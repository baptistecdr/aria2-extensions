export interface IOptions {
    capture: boolean;
    server: string;
    excludedProtocols: string[];
    excludedSites: string[];
    excludedFileTypes: string[];
}

export class Options {
    static new(): IOptions {
        const options = {} as IOptions;
        options.capture = false;
        options.server = "";
        options.excludedProtocols = [];
        options.excludedSites = [];
        options.excludedFileTypes = [];
        return options;
    }

    static toJSON(options: IOptions): string {
        return JSON.stringify(options);
    }

    static fromJSON(options: string): IOptions {
        return JSON.parse(options);
    }
}
