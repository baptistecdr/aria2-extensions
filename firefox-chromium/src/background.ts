/*async function showNotification(message) {
    const options = {
        type: 'basic',
        title: 'Aria2',
        iconUrl: 'icons/notificationicon.png',
        message: message
    };
    await browser.notifications.create('senttoaria2', options);
    window.setTimeout(() => browser.notifications.clear('senttoaria2'), 3000);
}*/

import {Utils} from "@/utils";
// @ts-ignore
import Aria2 from "aria2";

let connections: any = {};

function createContextMenus() {
    browser.contextMenus.create({
        title: browser.i18n.getMessage('context_menus_title') || 'Download with Aria2',
        id: 'linkclick',
        contexts: ['link', 'selection']
    });
    connections = {};
    for (const server of Utils.servers()) {
        const id = browser.contextMenus.create({
            title: `${server.name}`,
            parentId: 'linkclick',
            id: server.id,
            contexts: ['link', 'selection']
        });
        connections[id] = new Aria2(server);
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

async function getCurrentTab(): Promise<browser.tabs.Tab | undefined> {
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

browser.contextMenus.onClicked.addListener((info, tab) => {
    const aria2 = connections[0];
    const urls = [];
    if (info.linkUrl) {
        urls.push(info.linkUrl)
    } else if (info.selectionText) {
        info.selectionText.split(/\s+/).forEach(url => urls.push(url))
    }
    urls.forEach(async url => {
        try {
            const referer = tab?.url ?? '';
            const cookies = await getCookies(url);
            await Utils.captureUrl(aria2, url, referer, cookies);
            //await showNotificationSuccess();
        } catch (error) {
            // await showNotificationError(url, error);
        }
    });
});

browser.downloads.onCreated.addListener(async (downloadItem) => {
    const tab = await getCurrentTab();
    const referer = tab?.url ?? '';
    await browser.downloads.cancel(downloadItem.id);
    await browser.downloads.erase({id: downloadItem.id});
    const cookies = await getCookies(referer);
    const aria2 = connections[0];
    await Utils.captureDownloadItem(aria2, downloadItem, referer, cookies);
});

