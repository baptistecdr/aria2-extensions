import {IServer, Server} from "@/models/server";
import path from "path";
import DownloadItem = browser.downloads.DownloadItem;
import CreateNotificationOptions = browser.notifications.CreateNotificationOptions;
import {IOptions, Options} from "@/models/options";

export class Utils {
    static encodeFileToBase64(file: File | Blob) {
        return new Promise((resolve, reject) => {
            const temporaryFileReader = new FileReader();
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(`Cannot parse '${file}'.`);
            };
            temporaryFileReader.onload = () => {
                if (temporaryFileReader.result) {
                    const splitResult = temporaryFileReader.result.toString().split(new RegExp("[:;,]"));
                    if (splitResult.length >= 4) {
                        resolve(splitResult[3]);
                    } else {
                        reject(`Cannot get base64 encoded string for '${file}'.`);
                    }
                } else {
                    reject(`Result is empty for '${file}'.`);
                }
            };
            temporaryFileReader.readAsDataURL(file);
        });
    }

    static async download(url: string) {
        const res = await fetch(url);
        return await res.blob();
    }

    static async options(): Promise<IOptions> {
        const res = await browser.storage.sync.get("options");
        return res["options"] ? Options.fromJSON(res["options"]) : Options.new();
    }

    static async servers(): Promise<IServer[]> {
        const result = await browser.storage.sync.get(undefined);
        return Object.keys(result).filter(key => key !== "options").map(key => Server.fromJSON(result[key]));
    }

    static async captureTorrentOrMetalink(aria2: any, url: string, filename: string) {
        const blob = await Utils.download(url);
        const b64 = await Utils.encodeFileToBase64(blob);
        if (url.endsWith('.torrent') || filename.endsWith('.torrent')) {
            return aria2.call('aria2.addTorrent', b64);
        }
        return aria2.call('aria2.addMetalink', b64);
    }

    static async captureDownloadItem(aria2: any, item: DownloadItem, referer: string, cookies: string) {
        // @ts-ignore
        const url = item.finalUrl ?? item.url; // finalUrl (Chrome), url (Firefox)
        if (url.match(/\.torrent$|\.meta4$|\.metalink$/)) {
            return Utils.captureTorrentOrMetalink(aria2, url, "");
        }
        const isWin = process.platform === "win32";

        return aria2.call('aria2.addUri', [url], {
            header: [`Referer: ${referer}`, `Cookie: ${cookies}`],
            out: isWin ? path.win32.basename(item.filename) : path.basename(item.filename)
        });
    }

    static async captureUrl(aria2: any, url: string, referer: string, cookies: string) {
        if (url.match(/\.torrent$|\.meta4$|\.metalink$/)) {
            return Utils.captureTorrentOrMetalink(aria2, url, '');
        }
        return aria2.call('aria2.addUri', [url], {header: [`Referer: ${referer}`, `Cookie: ${cookies}`]});
    }

    static async showNotification(message: string) {
        const options: CreateNotificationOptions = {
            type: 'basic',
            title: 'Aria2',
            iconUrl: 'icons/icon80.png',
            message: message
        };
        const id = await browser.notifications.create('', options);
        window.setTimeout(() => browser.notifications.clear(id), 3000);
    }
}
