import * as store from 'store';
import {Settings} from '../downloader/settings';
import {Downloader} from '../downloader/downloader';

let settings = new Settings(store);
let downloader = new Downloader(settings);

async function showNotification(message) {
    const options = {
        type: 'basic',
        title: 'Aria2',
        iconUrl: 'icons/notificationicon.png',
        message: message
    };
    await browser.notifications.create('senttoaria2', options);
    window.setTimeout(() => browser.notifications.clear('senttoaria2'), 3000);
}

browser.runtime.onInstalled.addListener(async () => {
    await browser.runtime.openOptionsPage();
});

browser.menus.create({
    title: browser.i18n.getMessage('context_menus_title') || 'Download with Aria2',
    id: 'linkclick',
    contexts: ['link', 'selection']
});

async function showNotificationSuccess() {
    await showNotification(chrome.i18n.getMessage('notification_message_success') || 'The download cannot be sent to Aria2.')
}

async function showNotificationError(file, error) {
    console.error(`Cannot add '${file}' to the server. (${error})'`);
    await showNotification(chrome.i18n.getMessage('notification_message_error') || 'The download cannot be sent to Aria2.')
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    settings = new Settings(store);
    downloader = new Downloader(settings);
});

async function getCurrentTab() {
    const tabs = await browser.tabs.query({
        'active': true,
        'currentWindow': true
    });
    return tabs[0];
}

async function getCookies(url) {
    const cookies = await browser.cookies.getAll({
        'url': url
    });
    let result = '';
    cookies.forEach(cookie => result += `${cookie.name}=${cookie.value};`);
    return result;
}

browser.menus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'linkclick') {
        return;
    }
    const links = info.linkUrl ? [info.linkUrl] : info.selectionText.split(/\s+/);
    links.forEach(async link => {
        try {
            const cookies = await getCookies(link);
            await downloader.captureLink(link, tab, cookies);
            await showNotificationSuccess();
        } catch (error) {
            await showNotificationError(link, error);
        }
    });
});

browser.downloads.onCreated.addListener(async (downloadItem) => {
    try {
        const tab = await getCurrentTab();
        if (!settings.capture || !downloader.isCapture(downloadItem.totalBytes, tab.url, downloadItem.url, downloadItem.filename)) {
            return;
        }
        await browser.downloads.cancel(downloadItem.id);
        await browser.downloads.erase({id: downloadItem.id});
        const cookies = await getCookies(downloadItem.url);
        await downloader.captureDownloadFile(downloadItem, tab, cookies);
        await showNotificationSuccess();
    } catch (error) {
        await showNotificationError(downloadItem.url, error);
    }
});
