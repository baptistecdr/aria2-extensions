import {Utils} from "@/utils";
// @ts-ignore
import Aria2 from "aria2";
import CreateNotificationOptions = browser.notifications.CreateNotificationOptions;
import Tab = browser.tabs.Tab;

let connections: any = {};
let connectionForCaptureDownloads: any = undefined;

async function showNotification(message: string) {
    const options: CreateNotificationOptions = {
        type: 'basic',
        title: 'Aria2',
        iconUrl: 'icons/notificationicon.png',
        message: message
    };
    const id = await browser.notifications.create('', options);
    window.setTimeout(() => browser.notifications.clear(id), 3000);
}

function createContextMenus() {
    browser.contextMenus.create({
        title: browser.i18n.getMessage('contextMenusTitle'),
        id: 'linkclick',
        contexts: ['link', 'selection']
    });
    connections = {};
    for (const server of Utils.servers()) {
        const id = browser.contextMenus.create({
            title: `${server.name}`,
            parentId: 'linkclick',
            id: server.key,
            contexts: ['link', 'selection']
        });
        connections[id] = new Aria2(server);
        if (server.capture) {
            connectionForCaptureDownloads = connections[id];
        }
    }
}

browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await browser.runtime.openOptionsPage();
    }
    createContextMenus();
});

browser.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    await browser.contextMenus.removeAll();
    createContextMenus();
});

async function getCurrentTab(): Promise<Tab | undefined> {
    const tabs = await browser.tabs.query({
        'active': true,
        'currentWindow': true
    });
    if (tabs.length === 0) {
        return undefined;
    }
    return tabs[0];
}

async function getCookies(url: string): Promise<string> {
    const cookies = await browser.cookies.getAll({
        'url': url
    });
    return cookies.reduce((acc, cookie) => {
        return acc + `${cookie.name}=${cookie.value};`;
    }, '');
}

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    const aria2 = connections[info.menuItemId]!;
    const urls = [];
    if (info.linkUrl) {
        urls.push(info.linkUrl)
    } else if (info.selectionText) {
        info.selectionText.split(/\s+/).forEach(url => urls.push(url))
    }
    const referer = tab?.url ?? '';
    const cookies = await getCookies(referer);
    urls.forEach(url => {
        Utils.captureUrl(aria2, url, referer, cookies);
        showNotification('')
    });
});

browser.downloads.onCreated.addListener(async (downloadItem) => {
    if (connectionForCaptureDownloads !== undefined) {
        const tab = await getCurrentTab();
        const referer = tab?.url ?? '';
        const cookies = await getCookies(referer);
        await browser.downloads.cancel(downloadItem.id);
        await browser.downloads.erase({id: downloadItem.id});
        await Utils.captureDownloadItem(connectionForCaptureDownloads, downloadItem, referer, cookies);
    }
});

