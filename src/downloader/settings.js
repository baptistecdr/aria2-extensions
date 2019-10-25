export class Settings {
    constructor(settings) {
        this.settings = settings;
    }

    get host() {
        return this.settings.get("host") || "localhost";
    }

    set host(path) {
        this.settings.set("host", path);
    }

    get secure() {
        return this.settings.get("secure") || true;
    }

    set secure(secure) {
        this.settings.set("secure", secure);
    }

    get secret() {
        return this.settings.get("secret");
    }

    set secret(secret) {
        this.settings.set("secret", secret);
    }

    get port() {
        return this.settings.get("port") || 6800;
    }

    set port(port) {
        this.settings.set("port", port);
    }

    get fileSize() {
        return this.settings.get("fileSize") || "500M";
    }

    set fileSize(size) {
        this.settings.set("fileSize", size);
    }

    get whiteListTypes() {
        return this.settings.get("whiteListTypes") || [];
    }

    set whiteListTypes(types) {
        this.settings.set("whiteListTypes", types);
    }

    get whiteListSites() {
        return this.settings.get("whiteListSites") || [];
    }

    set whiteListSites(sites) {
        this.settings.set("whiteListSites", sites);
    }

    get blackListSites() {
        return this.settings.get("blackListSites") || [];
    }

    set blackListSites(sites) {
        this.settings.set("blackListSites", sites);
    }

    get protocolsWhitelist() {
        return this.settings.get("protocolsWhitelist") || ["blob", "http", "https"];
    }

    set protocolsWhitelist(protocols) {
        this.settings.set("protocolsWhitelist", protocols);
    }

    get capture() {
        return this.settings.get("capture") || false;
    }

    set capture(capture) {
        this.settings.set("capture", capture);
    }

    get sizeCapture() {
        return this.settings.get("sizeCapture");
    }

    set sizeCapture(sizeCapture) {
        this.settings.set("sizeCapture", sizeCapture);
    }

    join(values, sep = ',') {
        let result = '';
        values.forEach((value, index) => {
            result += value;
            if (index + 1 < values.length) {
                result += sep;
            }
        });
        return result;
    }

    toJSON() {
        let json = {};
        this.settings.each((value, key) => {
            json[key] = value;
        });
        return json;
    }
}
