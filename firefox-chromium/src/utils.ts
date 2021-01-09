import {IServer, Server} from "@/models/server";
import path from "path";
import DownloadItem = browser.downloads.DownloadItem;

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

    static servers(): IServer[] {
        const values = [] as IServer[];
        const keys = Object.keys(localStorage);

        keys.forEach(key => {
            const server = localStorage.getItem(key);
            if (server != null) {
                values.push(Server.fromJSON(server));
            }
        });
        return values;
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
        if (item.filename.match(/\.torrent$|\.meta4$|\.metalink$/)) {
            return Utils.captureTorrentOrMetalink(aria2, item.url, item.filename);
        }
        return aria2.call('aria2.addUri', [item.url], {
            header: [`Referer: ${referer}`, `Cookie: ${cookies}`],
            out: path.basename(item.filename)
        });
    }

    static async captureUrl(aria2: any, url: string, referer: string, cookies: string) {
        if (url.match(/\.torrent$|\.meta4$|\.metalink$/)) {
            return Utils.captureTorrentOrMetalink(aria2, url, '');
        }
        return aria2.call('aria2.addUri', [url], {header: [`Referer: ${referer}`, `Cookie: ${cookies}`]});
    }
}
