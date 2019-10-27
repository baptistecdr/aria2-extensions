import * as $ from 'jquery';
import 'popper.js'
import 'bootstrap'
import * as store from 'store';
import {Settings} from '../downloader/settings';

const settings = new Settings(store);

function loadSettings() {
    $('#host').prop('value', settings.host);
    $('#secure').prop('checked', settings.secure);
    $('#port').prop('value', settings.port);
    $('#secret').prop('value', settings.secret);
    $('#enable-capture').prop('checked', settings.capture);
    $('#enable-capture').trigger('change');
    $('#enable-file-size').prop('checked', settings.sizeCapture);
    $('#enable-file-size').trigger('change');
    const fileSize = settings.fileSize.match(/^(\d*)([KMGT])/i);
    $('#file-size').prop('value', fileSize[1]);
    $('#files-size-type').prop('value', fileSize[2]);
    $('#files-types').prop('value', settings.join(settings.whiteListTypes, ', '));
    $('#sites-whitelist').prop('value', settings.join(settings.whiteListSites, ', '));
    $('#sites-blacklist').prop('value', settings.join(settings.blackListSites, ', '));
    $('#protocols-whitelist').prop('value', settings.join(settings.protocolsWhitelist, ', '));
}

function saveSettings() {
    const spaceRegex = new RegExp(/\s+/g);
    settings.host = $('#host').prop('value');
    settings.secure = $('#secure').prop('checked');
    settings.port = $('#port').prop('value');
    settings.secret = $('#secret').prop('value');
    settings.capture = $('#enable-capture').prop('checked');
    settings.sizeCapture = $('#enable-file-size').prop('checked');
    settings.fileSize = $('#file-size').prop('value') + $('#file-size-type').prop('value');
    settings.whiteListTypes = $('#file-types').prop('value').split(',')
        .map(value => value.replace(spaceRegex, ''));
    settings.whiteListSites = $('#sites-whitelist').prop('value').split(',')
        .map(value => value.replace(spaceRegex, ''));
    settings.blackListSites = $('#sites-blacklist').prop('value').split(',')
        .map(value => value.replace(spaceRegex, ''));
    settings.protocolsWhitelist = $('#protocols-whitelist').prop('value').split(',')
        .map(value => value.replace(spaceRegex, ''));
    $('#btn-save').removeClass('btn-primary');
    $('#btn-save').addClass('btn-outline-success');
    window.setTimeout(() => {
        $('#btn-save').removeClass('btn-outline-success');
        $('#btn-save').addClass('btn-primary');
    }, 1000);
}

$('#enable-capture').on('change',  (e) => {
    if(e.target.checked) {
        $('#form-enable-capture').removeAttr('disabled');
    } else {
        $('#form-enable-capture').prop('disabled', 'disabled');
    }
});

$('#enable-file-size').on('change',  (e) => {
    if(e.target.checked) {
        $('#form-enable-file-size').removeAttr('disabled');
    } else {
        $('#form-enable-file-size').prop('disabled', 'disabled');
    }
});

function localize() {
    const elements = $('[data-localize]');
    elements.get().forEach((element) => {
        const key = element.getAttribute('data-localize');
        const value = chrome.i18n.getMessage(key);
        element.innerHTML = value || element.innerHTML;
    });
}

loadSettings();
saveSettings();
localize();

$('#settings-form').on('submit', (e) => {
    e.preventDefault();
    saveSettings();
});
