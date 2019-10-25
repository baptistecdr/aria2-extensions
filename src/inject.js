chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.range === 'cookie') {
        sendResponse({pagecookie: document.cookie});
    }
    if (message.range === 'both') {
        sendResponse({pagecookie: document.cookie, taburl: document.URL});
    }
});
