#!/usr/bin/env node
const fs = require('fs');

if(process.argv.length <= 2) {
    console.error("You need to specify a new version.");
    process.exit();
}
const version = process.argv[2];
const filesToUpdate = ["package.json", "src/chrome/manifest.json", "src/firefox/manifest.json"];

filesToUpdate.forEach(file => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.error(`Unable to read the content of the file '${file}'. (${err})`);
        } else {
            const content = JSON.parse(data);
            content.version = version;
            fs.writeFile(file, JSON.stringify(content, null, 2), err1 => {
                if(err1) {
                    console.error(`Unable to write the new content of the file '${file}'. (${err1})`);
                }
            });
        }
    });
});

