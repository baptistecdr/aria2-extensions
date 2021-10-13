<h3 align="center">Aria2 Integration</h3>
<p align="center">
    Aria2 Integration allows you to redirect downloads to your Aria2 server.
    <br>
    <a href="https://github.com/baptistecdr/aria2-extensions/issues/new">Report bug</a>
    ·
    <a href="https://github.com/baptistecdr/aria2-extensions/issues/new">Request feature</a>
</p>

<p align="center">
    <img src="img/firefox/popup_no_download_light.png" alt="No task (Light)" width="400px"/>
    <img src="img/firefox/popup_no_download_dark.png" alt="No task (Dark)" width="400px"/>
</p>
<p align="center">
    <img src="img/firefox/popup_add_download_light.png" alt="Add Task (Light)" width="400px"/>
    <img src="img/firefox/popup_add_download_dark.png" alt="Add Task (Dark)" width="400px"/>
</p>
<p align="center">
    <img src="img/firefox/popup_download_running_light.png" alt="Task running (Light)" width="400px"/>
    <img src="img/firefox/popup_download_running_dark.png" alt="Task running (Dark)" width="400px"/>
</p>
<p align="center">
    <img src="img/firefox/popup_download_pause_light.png" alt="Task paused (Light)" width="400px"/>
    <img src="img/firefox/popup_download_pause_dark.png" alt="Task paused (Dark)" width="400px"/>
</p>
<p align="center">
    <img src="img/firefox/popup_download_finished_light.png" alt="Task finished (Light)" width="400px"/>
    <img src="img/firefox/popup_download_finished_dark.png" alt="Task finished (Dark)" width="400px"/>
</p>
<p align="center">
    <img src="https://i.snipboard.io/pkvBhL.jpg" alt="Aria2 Integration App" width="400px">
    <img src="https://i.snipboard.io/Bk6xI2.jpg" alt="Aria2 Integration App" width="400px">
</p>
<p align="center">
    <img src="https://i.snipboard.io/joBJmv.jpg" alt="Task finished Safari" width="400px">
    <img src="https://i.snipboard.io/6Fajxw.jpg" alt="Task finished Safari" width="400px">  
</p>

## Description

Aria2 Integration allows you to redirect downloads to your Aria2 server. This setting can be tuned in the extension's
preferences :

- You can enable/disable this functionality
- You can exclude some protocols, sites or/and file types

In addition, you can send download links via the context menus:

- Right click on a link and select your server in "Download with Aria2"
- Right click on multiple text links and select you server in "Download with Aria2"

By clicking on the extension icon, a popup appear. You can see the progress of each Aria2 server:

- Total download/upload speed
- Progress of each task and possibility to pause/resume/delete
- Delete all finished tasks
- Add links, torrent files, magnets link/files
- A quick settings to enable/disable download redirection

Finally, the extension is available in light/dark theme depending on your system preferences and you can add multiple servers in the extension's preferences.

## Quick start

- [Chrome Web Store](https://chrome.google.com/webstore/detail/aria2-integration/hnenidncmoeebipinjdfniagjnfjbapi)
- [Firefox Extension Store](https://addons.mozilla.org/en-US/firefox/addon/aria2-extension/)

## How to build

### Firefox and Chromium

- Install [Node.JS](https://nodejs.org/) LTS
- Clone the project
- Run `cd firefox-chromium`
- Run `npm install`
- Run `npm run firefox-build` to build Firefox extension
- Run `npm run chrome-build` to build Chrome extension

#### Development

- Run `npm run serve` to build and hot-reloads for development
- Run `npm run lint` to lint and fixes files

#### Internationalization

* The extension speaks English and French but you can add your language
  in [public/_locales](https://github.com/baptistecdr/aria2-extensions/tree/master/firefox-chromium/public/_locales).
  You can find your language
  code [here](https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc#l23).

### Safari

- Open `safari/Aria2 Integration.xcodeproj` with XCode
- Build & Run the project

## Bugs and feature requests

Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not
addressed yet, [please open a new issue](https://github.com/baptistecdr/aria2-extensions/issues/new).

## Contributing

Contributions are welcome!

## Confidentiality

Cookies read are only transmitted to Aria2 instance. Be sure to use a secure connection between your computer and the
instance.

## Thanks to

- https://github.com/robbielj/chrome-aria2-integration
- https://github.com/rahuliyer95/chrome-aria2-integration
- <div>Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
