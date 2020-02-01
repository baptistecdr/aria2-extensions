import Aria2 from 'aria2';

export class Downloader {
    constructor(settings) {
        this.settings = settings;
        this.aria2 = new Aria2(settings.toJSON());
    }

    isCapture(size, tabUrl, url, name) {
        const bSites = this.siteListProc(this.settings.join(this.settings.blackListSites)),
            wSites = this.siteListProc(this.settings.join(this.settings.whiteListSites)),
            wTypes = this.settings.whiteListTypes.map(type => type.toLocaleLowerCase()),
            wProtocols = new RegExp(`^(${this.settings.join(this.settings.protocolsWhitelist, '|')})`),
            fSize = this.settings.fileSize, fSizePrec = ['K', 'M', 'G', 'T'],
            fSizeBytes = parseFloat(fSize.match(/[\d.]+/)[0]) * Math.pow(1024, fSizePrec.indexOf(fSize.match(/[a-zA-Z]+/)[0].toUpperCase()) + 1);
        switch (true) {
            // Skip blacklist sites
            case bSites.test(tabUrl):
                return false;
            // Accept whitelist sites
            case wSites.test(tabUrl):
                return true;
            // Protocol
            case url.match(wProtocols) !== null:
                switch (true) {
                    // Accept whitelisted types
                    case wTypes.indexOf(name.split('.').pop().toLocaleLowerCase()) !== -1:
                        return true;
                    // Accept if size capture is disabled
                    case !this.settings.sizeCapture:
                        return true;
                    // Only accept above file sizes
                    case size >= fSizeBytes:
                        return true;
                    default:
                        return false;
                }
            default:
                return false;
        }
    }

    connect() {
        return this.aria2.open();
    }

    addUri(uri, options) {
        return this.aria2.call('addUri', [uri], options);
    }

    pause(gid) {
        return this.aria2.call('pause', gid);
    }

    unpause(gid) {
        return this.aria2.call('unpause', gid);
    }

    addTorrent(torrent) {
        return this.aria2.call('addTorrent', torrent);
    }

    addMetalink(metalink) {
        return this.aria2.call('addMetalink', metalink);
    }

    getGlobalStat() {
        return this.aria2.call('getGlobalStat', [], {});
    }

    getDownloads(offsetWaiting, numWaiting, offsetStopped, numStopped) {
        return this.aria2.multicall(
            [
                ['tellActive'],
                ['tellWaiting', offsetWaiting, numWaiting],
                ['tellStopped', offsetStopped, numStopped],
            ]
        );
    }

    purgeDownloadResult() {
        return this.aria2.call('purgeDownloadResult');
    }

    removeDownloadResult(gid) {
        return this.aria2.call('removeDownloadResult', gid);
    }

    remove(gid) {
        return this.aria2.call('remove', gid);
    }

    siteListProc(site) {
        return site === ''
            ? new RegExp('^\\s$', 'g')
            : new RegExp(site.replace(/\./g, '\\.').replace(/,/g, '|').replace(/\*/g, '[^ ]*'), 'gi');
    }

    encodeTorrentOrMetalinkFile(file) {
        return new Promise((resolve, reject) => {
            const temporaryFileReader = new FileReader();
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(`Cannot parse '${file}'.`);
            };
            temporaryFileReader.onload = () => {
                resolve(btoa(temporaryFileReader.result));
            };
            temporaryFileReader.readAsBinaryString(file);
        });
    };

    async captureTorrentOrMetalink(url, filename) {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const b64 = await this.encodeTorrentOrMetalinkFile(blob);
            if (url.endsWith('.torrent') || filename.endsWith('.torrent')) {
                return this.addTorrent(b64);
            } else {
                return this.addMetalink(b64);
            }
        } catch (e) {
            throw e;
        }
    }

    async captureDownloadFile(item, tab, cookies) {
        if (item.filename.match(/\.torrent$|\.meta4$|\.metalink$/)) {
            return this.captureTorrentOrMetalink(item.url, item.filename);
        } else {
            return this.addUri(item.url, {header: [`Referer: ${tab.url}`, `Cookie: ${cookies}`]});
        }
    }

    async captureLink(link, tab, cookies) {
        if (link.match(/\.torrent$|\.meta4$|\.metalink$/)) {
            return this.captureTorrentOrMetalink(link, '');
        } else {
            return this.addUri(link, {header: [`Referer: ${tab.url}`, `Cookie: ${cookies}`]});
        }
    }
}
