import * as store from 'store';
import {Settings} from '../downloader/settings';
import {Downloader} from '../downloader/downloader';

let settings = new Settings(store);
let downloader = new Downloader(settings);

function showNotification(message) {
    const options = {
        type: 'basic',
        title: 'Aria2',
        iconUrl: 'icons/notificationicon.png',
        message: message
    };
    chrome.notifications.create('senttoaria2', options, () => {
    });
    window.setTimeout(() => chrome.notifications.clear('senttoaria2', () => {
    }), 3000);
}

chrome.runtime.onInstalled.addListener((details) => {
    chrome.contextMenus.create({
        title: chrome.i18n.getMessage('context_menus_title') || 'Download with Aria2',
        id: 'linkclick',
        contexts: ['link', 'selection']
    });
    chrome.runtime.openOptionsPage();
});

function showNotificationSuccess() {
    showNotification(chrome.i18n.getMessage('notification_message_success') || 'The download cannot be sent to Aria2.')
}

function showNotificationError(file, error) {
    console.error(`Cannot add '${file}' to the server. (${error})'`);
    showNotification(chrome.i18n.getMessage('notification_message_error') || 'The download cannot be sent to Aria2.')
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    settings = new Settings(store);
    downloader = new Downloader(settings);
});

function getCurrentTab() {
    return new Promise((resolve) => {
        chrome.tabs.query({'active': true, 'currentWindow': true}, tabs => resolve(tabs[0]));
    })
}

function getCookies(url) {
    return new Promise((resolve) => {
        chrome.cookies.getAll({
            'url': url
        }, cookies => {
            let result = '';
            cookies.forEach(cookie => result += `${cookie.name}=${cookie.value};`);
            resolve(result);
        });
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId !== 'linkclick') {
        return;
    }
    let links = info.linkUrl ? [info.linkUrl] : info.selectionText.split(/\s+/);
    links.forEach(async (link) => {
        try {
            const cookies = await getCookies(link);
            await downloader.captureLink(link, tab, cookies);
            await showNotificationSuccess();
        } catch (error) {
            await showNotificationError(link, error);
        }
    });
});

chrome.downloads.onDeterminingFilename.addListener(async downloadItem => {
    try {
        const tab = await getCurrentTab();
        if (!settings.capture || !downloader.isCapture(downloadItem.totalBytes, tab.url, downloadItem.url, downloadItem.filename)) {
            return;
        }
        chrome.downloads.cancel(downloadItem.id, null);
        chrome.downloads.erase({"id": downloadItem.id}, null);
        const cookies = await getCookies(downloadItem.url);
        await downloader.captureDownloadFile(downloadItem, tab, cookies);
        await showNotificationSuccess();
    } catch (error) {
        await showNotificationError(downloadItem.url, error);
    }
});
