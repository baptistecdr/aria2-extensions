document.addEventListener("contextmenu", function (event) {
    console.log(event)
    const selectedText = window.getSelection().toString();
    safari.extension.setContextMenuEventUserInfo(event,
        {"selectedText": selectedText, "referer": document.URL, "cookies": document.cookie, "link": event.target.href});
}, false);
