import {Utils} from "@/utils";
// @ts-ignore
import Aria2 from "aria2";
import {Server} from "@/models/server";
import {Options} from "@/models/options";
import DownloadItem = browser.downloads.DownloadItem;

const CONTEXT_MENUS_PARENT_ID = "aria2-integration"

const connections: any = {};
let connectionForCaptureDownloads: any = undefined;
let options = Options.new();

(async () => await initConnections())();
(async () => await createContextMenus())();

async function initConnections() {
    options = await Utils.options();
    for (const server of await Utils.servers()) {
        connections[server.key] = new Aria2(server);
        if (options.capture && options.server === server.key) {
            connectionForCaptureDownloads = connections[server.key];
        }
    }
}

browser.storage.onChanged.addListener(async (changes) => {
    const keys = Object.keys(changes);
    for (const key of keys) {
        // Extension options
        if (key === "options") {
            options = Options.fromJSON(changes[key].newValue);
        }
        // New value
        else if (changes[key].oldValue === undefined) {
            const server = Server.fromJSON(changes[key].newValue);
            browser.contextMenus.create({
                title: `${server.name}`,
                parentId: CONTEXT_MENUS_PARENT_ID,
                id: server.key,
                contexts: ['link', 'selection']
            });
            connections[server.key] = new Aria2(server);
        }
        // Remove
        else if (changes[key].newValue === undefined) {
            const server = Server.fromJSON(changes[key].oldValue);
            await browser.contextMenus.remove(server.key);
            delete connections[server.key];
        }
        // Update
        else {
            const server = Server.fromJSON(changes[key].newValue);
            connections[server.key] = new Aria2(server);
            await browser.contextMenus.update(server.key, {
                title: `${server.name}`
            });
        }
    }
});

async function createContextMenus() {
    await browser.contextMenus.removeAll();
    browser.contextMenus.create({
        title: browser.i18n.getMessage('contextMenusTitle'),
        id: CONTEXT_MENUS_PARENT_ID,
        contexts: ['link', 'selection']
    });
    for (const server of await Utils.servers()) {
        browser.contextMenus.create({
            title: `${server.name}`,
            parentId: CONTEXT_MENUS_PARENT_ID,
            id: server.key,
            contexts: ['link', 'selection']
        });
    }
}

browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await browser.runtime.openOptionsPage();
    }
});

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
        info.selectionText.split(/\s+/).forEach(url => urls.push(url));
    }
    const referer = tab?.url ?? '';
    const cookies = await getCookies(referer);
    for (const url of urls) {
        try {
            await Utils.captureUrl(aria2, url, referer, cookies);
            await Utils.showNotification(browser.i18n.getMessage("addUrlSuccess", aria2.name));
        } catch (e) {
            await Utils.showNotification(browser.i18n.getMessage('addUrlError', aria2.name));
        }
    }
});

function downloadItemMustBeCaptured(referrer: string, item: DownloadItem): boolean {
    const protocolsRegExp = new RegExp(`^${options.excludedProtocols.map(p => `(${p})`).join("|^")}`);
    const sitesRegExp = new RegExp(`${options.excludedSites.map(s => `(${s})`).join("|")}`);
    const fileTypesRegExp = new RegExp(`${options.excludedFileTypes.join("$|")}$`);

    // @ts-ignore
    const url = item.finalUrl ?? item.url;

    return !(options.excludedProtocols.length > 0 && protocolsRegExp.test(url))
        || !(options.excludedSites.length > 0 && (sitesRegExp.test(referrer) || sitesRegExp.test(url)))
        || !(options.excludedFileTypes.length > 0 && fileTypesRegExp.test(url))
}

browser.downloads.onCreated.addListener(async (downloadItem) => {
    if (connectionForCaptureDownloads !== undefined && options.capture) {
        const referrer = downloadItem.referrer ?? "";
        const cookies = await getCookies(referrer);
        if (downloadItemMustBeCaptured(referrer, downloadItem)) {
            try {
                await browser.downloads.cancel(downloadItem.id);
                await browser.downloads.erase({id: downloadItem.id});
                await Utils.captureDownloadItem(connectionForCaptureDownloads, downloadItem, referrer, cookies);
                await Utils.showNotification(browser.i18n.getMessage("addFileSuccess", connectionForCaptureDownloads.name));
            } catch {
                await Utils.showNotification(browser.i18n.getMessage('addFileError', connectionForCaptureDownloads.name));
            }
        }
    }
});

