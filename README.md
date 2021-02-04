<h3 align="center">Aria2 Integration</h3>
<p align="center">
    Captures new download tasks and sends them to Aria2 automatically.
    <br>
    <a href="https://github.com/baptistecdr/aria2-extensions/issues/new">Report bug</a>
    ·
    <a href="https://github.com/baptistecdr/aria2-extensions/issues/new">Request feature</a>
</p>

<p align="center">
    <img src="https://snipboard.io/xBDZ0E.jpg" alt="No task" width="400px"/>
    <img src="https://i.snipboard.io/h6XYs7.jpg" alt="No task" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/hm89Ed.jpg" alt="Add task" width="400px"/>
    <img src="https://i.snipboard.io/RhgFQX.jpg" alt="Add task" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/YsXzhB.jpg" alt="Task running" width="400px"/>
    <img src="https://i.snipboard.io/REru8T.jpg" alt="Task running" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/e64IFV.jpg" alt="Task paused" width="400px"/>
    <img src="https://i.snipboard.io/Ycoij2.jpg" alt="Task paused" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/FbyZBJ.jpg" alt="Task finished" width="400px"/>
    <img src="https://i.snipboard.io/Liwpn5.jpg" alt="Task finished" width="400px"/>
</p>
<p align="center">
    <img src="https://i.snipboard.io/i1rm3z.jpg" alt="Task removed" width="400px"/>
    <img src="https://i.snipboard.io/wuV5N8.jpg" alt="Task removed" width="400px"/>
</p>
<p align="center">
    <img src="https://i.snipboard.io/pkvBhL.jpg" alt="Aria2 Integration App" width="400px">
    <img src="https://i.snipboard.io/Bk6xI2.jpg" alt="Aria2 Integration App" width="400px">
</p>
<p align="center">
    <img src="https://i.snipboard.io/joBJmv.jpg" alt="Task finished Safari" width="400px">
    <img src="https://i.snipboard.io/6Fajxw.jpg" alt="Task finished Safari" width="400px">  
</p>

## Table of contents
- [Quick start](#quick-start)
- [How to build](#how-to-build)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [Thanks to](#thanks-to)

## Description
- This extension captures new download tasks and sends them to aria2 automatically.
- It also adds a context menu item
    - Right click any link or select multiple links and click "Download with Aria2" to add to Aria2 download queue.
- Click the extension icon to reveal a quick view of tasks
    - Click on a progress bar to pause/unpause a task.
    - You can add URLs, magnets links and torrent files. 

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
* The extension speaks English and French but you can add your language in [public/_locales](https://github.com/baptistecdr/aria2-extensions/tree/master/firefox-chromium/public/_locales). You can find your language code [here](https://src.chromium.org/viewvc/chrome/trunk/src/third_party/cld/languages/internal/languages.cc#l23).

### Safari
- Open `safari/Aria2 Integration.xcodeproj` with XCode
- Build & Run the project

## Bugs and feature requests
Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/baptistecdr/aria2-extensions/issues/new).

## Contributing
Contributions are welcome!

## Contributors

## Confidentiality

Cookies read are only transmitted to Aria2 instance. Be sure to use a secure connection between your computer and the instance.

## Thanks to
- https://github.com/robbielj/chrome-aria2-integration
- https://github.com/rahuliyer95/chrome-aria2-integration
- <div>Icons made by <a href="https://www.flaticon.com/authors/dinosoftlabs" title="DinosoftLabs">DinosoftLabs</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>
