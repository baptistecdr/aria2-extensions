<h3 align="center">Aria2c Integration</h3>
<p align="center">
    Captures new download tasks and sends them to Aria2 automatically.
    <br>
    <a href="https://github.com/baptistecdr/aria2-extensions/issues/new">Report bug</a>
    ·
    <a href="https://github.com/baptistecdr/aria2-extensions/issues/new">Request feature</a>
</p>

<p align="center">
    <img src="https://snipboard.io/xBDZ0E.jpg" alt="No task" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/hm89Ed.jpg" alt="Add task" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/YsXzhB.jpg" alt="Task running" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/e64IFV.jpg" alt="Task paused" width="400px"/>
</p>
<p align="center">
    <img src="https://snipboard.io/FbyZBJ.jpg" alt="Task finished" width="400px"/>
</p>

## Table of contents
- [Quick start](#quick-start)
- [How to build](#how-to-build)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Contributing](#contributing)
- [Contibutors](#contributors)
- [Thanks to](#thanks-to)

## Description
- This extension captures new download tasks and sends them to aria2 automatically.
- It also adds a context menu item
    - Right click any link or select multiple links and click "Download with Aria2" to add to Aria2 download queue.
- Click the extension icon to reveal a quick view of tasks
    - Click on a progress bar to pause/unpause a task.
    - You can add URLs, magnets links and torrent files. 

## Quick start
- [Chrome Web Store]()
- [Firefox Extension Store](https://addons.mozilla.org/en-US/firefox/addon/aria2-extension/)

## How to build
- Install [Node.JS](https://nodejs.org/) LTS or current
- Install [Gulp](https://gulpjs.com/)
- Clone the project
- Run `npm install`
- Run `gulp` to build Chrome and Firefox extension
    - Run `gulp chrome` to build Chrome extension
    - Run `gulp firefox` to build Firefox extension

## Bugs and feature requests
Have a bug or a feature request? Please first search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/baptistecdr/aria2-extensions/issues/new).

## Contributing
Contributions are welcome!

## Contributors

## Thanks to
- https://github.com/robbielj/chrome-aria2-integration
- https://github.com/rahuliyer95/chrome-aria2-integration
