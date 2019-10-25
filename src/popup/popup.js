import * as $ from 'jquery';
import 'popper.js'
import 'bootstrap'
import * as store from 'store';
import * as Mustache from 'mustache';
import {Downloader} from '../downloader/downloader'
import {Settings} from '../downloader/settings';
import filesize from 'filesize';
import path from 'path';

const settings = new Settings(store);
const downloader = new Downloader(settings);

(async () => await downloader.connect())();

let waitingDownload = 0;
let stoppedDownload = 0;

const templateGlobalStat = $('#template-global-stat').html();
const templateDownload = $('#template-download').html();
Mustache.parse(templateGlobalStat);
Mustache.parse(templateDownload);

const pageGlobalStat = $('#page-global-stat');
const pageDownloads = $('#page-downloads');
const pageAddUrlsMagnets = $('#page-add-urls-magnets');
const iptTorrents = $('#input-torrents');
const tbxUrlsMagnets = $('#tbx-urls-magnets');

pageAddUrlsMagnets.hide();
let currentPage = 'downloads';

function toHHMMSS(sec) {
    let sec_num = parseInt(sec, 10);
    let hours = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    return `${hours}:${minutes}:${seconds}`;
}

function localize() {
    const elements = $('[data-localize]');
    elements.get().forEach((element) => {
        const key = element.getAttribute('data-localize');
        const value = chrome.i18n.getMessage(key);
        if (key === 'popup_add_links') {
            element.setAttribute('placeholder', value || element.getAttribute('placeholder'));
        } else {
            element.innerHTML = value || element.innerHTML;
        }
    });
}

function doValidationEffect(element, effect, timeOut = 700) {
    element.addClass(effect);
    window.setTimeout(() => {
        element.removeClass(effect);
    }, timeOut);
}

async function getDownloads() {
    let downloads = {
        result: []
    };
    try {
        const response = await downloader.getDownloads(0, waitingDownload, 0, stoppedDownload);
        for (let i = 0; i < response.length; i++) {
            $.each(response[i], (i, categories) => {
                $.each(categories, (j, download) => {
                    if (download !== undefined) {
                        download.filename = download.bittorrent ? download.bittorrent.info.name : path.basename(download.files[0].path);
                        download.completedLengthFormatted = filesize(download.completedLength);
                        download.totalLengthFormatted = filesize(download.totalLength);
                        download.downloadSpeedFormatted = `${filesize(download.downloadSpeed)}/s`;
                        download.uploadSpeedFormatted = `${filesize(download.uploadSpeed)}/s`;
                        download.eta = download.status !== 'active' ? null : download.downloadSpeed === '0' ? '∞' : toHHMMSS((download.totalLength - download.completedLength) / download.downloadSpeed);
                        download.percentage = Math.round(download.completedLength * 100 / download.totalLength) || 0;
                        download.style = download.status === 'complete' ? 'bg-success' : (download.status === 'waiting' || download.status === 'paused') ? 'bg-warning' : download.status === 'error' || download.status === 'removed' ? 'bg-danger' : '';
                        download.color = download.percentage >= 50 ? 'text-white' : '';
                        downloads.result.push(download);
                    }
                });
            });
        }
        pageDownloads.html(Mustache.render(templateDownload, downloads));
        localize();
    } catch (error) {
        console.error(`Cannot get downloads from the server. ${error}`);
    }
    $('.btn-delete-download').on('click', async (e) => {
        const [status, gid] = e.target.id.split('_');
        try {
            if (status === 'active') {
                await downloader.remove(gid);
            } else {
                await downloader.removeDownloadResult(gid);
            }
        } catch (error) {
            console.error(`Cannot remove download result with gid '${gid}'. (${error})`);
        }
    });
}

async function globalStat() {
    try {
        const response = await downloader.getGlobalStat();
        waitingDownload = parseInt(response.numWaiting);
        stoppedDownload = parseInt(response.numStopped);
        const rendered = Mustache.render(templateGlobalStat, {
            downloadSpeed: `${filesize(response.downloadSpeed)}/s`,
            uploadSpeed: `${filesize(response.uploadSpeed)}/s`
        });
        pageGlobalStat.html(rendered);
    } catch (error) {
        console.error(`Cannot get global stat from th server. (${error})`);
    }
}

async function refresh() {
    await globalStat();
    await getDownloads();
}

(async () => await refresh())();

setInterval(refresh, 1000);

$('#btn-show-add').on('click', (e) => {
    if (currentPage === 'downloads') {
        currentPage = 'add_urls_magnets';
        pageDownloads.hide();
        pageAddUrlsMagnets.show();
        e.target.dataset.localize = 'popup_cancel';
        e.target.innerHTML = 'Cancel';
    } else {
        currentPage = 'downloads';
        pageDownloads.show();
        pageAddUrlsMagnets.hide();
        e.target.dataset.localize = 'popup_add';
        e.target.innerHTML = 'Add';
    }
});

$('#btn-add').on('click', () => {
    tbxUrlsMagnets.val().split('\n').forEach(async (link) => {
        try {
            await downloader.captureLink(link, {});
            await doValidationEffect(tbxUrlsMagnets, 'is-valid');
        } catch (error) {
            console.error(`Cannot add '${link}' to the server. (${error})'`);
            doValidationEffect(tbxUrlsMagnets, 'is-invalid');
        }
        tbxUrlsMagnets.val('');
    });
});

$('#btn-purge').on('click', async () => {
    await downloader.purgeDownloadResult()
        .catch((error) => console.error(`Cannot purge download from the server. (${error})'`));
});

$('#btn-add-torrent').on('click', () => {
    $.each(iptTorrents[0].files, async (index, file) => {
        try {
            const b64 = await downloader.encodeTorrentOrMetalinkFile(file);
            if (file.name.endsWith('.torrent')) {
                await downloader.addTorrent(b64);
            } else {
                await downloader.addMetalink(b64);
            }
            doValidationEffect(iptTorrents, 'is-valid');
        } catch (error) {
            console.error(`Cannot add '${file.name}' to the server. (${error})'`);
            doValidationEffect(iptTorrents, 'is-invalid');
        }
        iptTorrents.val('');
    });
});
