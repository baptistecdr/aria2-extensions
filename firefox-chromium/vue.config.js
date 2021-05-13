module.exports = {
    pages: {
        popup: {
            template: 'public/browser-extension.html',
            entry: './src/popup/main.ts',
            title: 'Popup'
        },
        options: {
            template: 'public/browser-extension.html',
            entry: './src/options/main.ts',
            title: 'Options'
        }
    },
    pluginOptions: {
        browserExtension: {
            componentOptions: {
                background: {
                    entry: 'src/background.ts'
                },
            },
            manifestTransformer: (manifest) => {
                if (process.env.BROWSER === 'firefox') {
                    manifest["browser_specific_settings"] = {
                        "gecko": {
                            "id": "baptistecdr@users.noreply.github.com",
                            "strict_min_version": "69.0"
                        }
                    };
                }
                return manifest;
            },
        }
    }
}
