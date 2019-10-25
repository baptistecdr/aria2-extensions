const del = require('del');
const gulp = require('gulp');
const htmlMinify = require('gulp-htmlmin');
const jsonMinify = require('gulp-json-minify');
const sass = require('gulp-sass');
const babel = require("gulp-babel");
const webpack = require('webpack-stream');
const TerserPlugin = require('terser-webpack-plugin');
const pipeline = require('readable-stream').pipeline;

///
// Config
///

const htmlMinifyConfig = {
    collapseWhitespace: true,
    collapseInlineTagWhitespace: true,
    minifyCSS: true,
    sortAttributes: true,
    sortClassNames: true
};

function webpackConfig(output) {
    return {
        output: {
            filename: output
        },
        optimization: {
            minimize: true,
            minimizer: [
                new TerserPlugin(),
            ],
        },
        mode: 'production'
    };
}

///
// Base
///

gulp.task('clean', () => {
    return del('dist');
});

function popupJs(directory) {
    return pipeline(gulp.src('src/popup/popup.js'), babel(), webpack(webpackConfig('popup.js')), gulp.dest(`dist/${directory}/popup/`));
}

function settingsJs(directory) {
    return pipeline(gulp.src('src/settings/settings.ctrl.js'), babel(), webpack(webpackConfig('settings.ctrl.js')),
        gulp.dest(`dist/${directory}/settings/`));
}

function html(directory) {
    return pipeline(gulp.src('src/**/*.html'), htmlMinify(htmlMinifyConfig), gulp.dest(`dist/${directory}`));
}

function css(directory) {
    return pipeline(gulp.src("src/app.scss"), sass(), htmlMinify(htmlMinifyConfig), gulp.dest(`dist/${directory}/`))
}

function injectJs(directory) {
    return pipeline(gulp.src('src/inject.js'), babel(), webpack(webpackConfig('inject.js')), gulp.dest(`dist/${directory}/`));
}

function locales(directory) {
    return pipeline(gulp.src('src/_locales/**/*.json'), jsonMinify(), gulp.dest(`dist/${directory}/_locales`));
}

function icons(directory) {
    return pipeline(gulp.src('src/icons/*'), gulp.dest(`dist/${directory}/icons`));
}

function manifest(directory) {
    return pipeline(gulp.src(`src/${directory}/manifest.json`), jsonMinify(), gulp.dest(`dist/${directory}/`));
}

function backgroundJs(directory) {
    return pipeline(gulp.src(`src/${directory}/background.js`), babel(), webpack(webpackConfig('background.js')), gulp.dest(`dist/${directory}/`));
}

///
// Chrome
///

const chromeManifest = () => manifest('chrome');
const chromeHtml = () => html('chrome');
const chromeLocales = () => locales('chrome');
const chromeIcons = () => icons('chrome');
const chromeSettingsJs = () => settingsJs('chrome');
const chromePopupJs = () => popupJs('chrome');
const chromeCss = () => css('chrome');
const chromeBackgroundJs = () => backgroundJs('chrome');
const chromeInjectJs = () => injectJs('chrome');


gulp.task("chrome", gulp.series(chromeManifest, chromeBackgroundJs, chromeHtml, chromeLocales, chromeIcons, chromeSettingsJs, chromePopupJs, chromeCss, chromeInjectJs));
gulp.task("chrome:popup", gulp.series(chromeManifest, chromeHtml, chromeCss, chromeLocales, chromePopupJs));
gulp.task("chrome:background", gulp.series(chromeManifest, chromeHtml, chromeCss, chromeLocales, chromeBackgroundJs));
gulp.task("chrome:settings", gulp.series(chromeManifest, chromeHtml, chromeCss, chromeLocales, chromeSettingsJs));

///
// Firefox
///

const firefoxManifest = () => manifest('firefox');
const firefoxHtml = () => html('firefox');
const firefoxLocales = () => locales('firefox');
const firefoxIcons = () => icons('firefox');
const firefoxSettingsJs = () => settingsJs('firefox');
const firefoxPopupJs = () => popupJs('firefox');
const firefoxCss = () => css('firefox');
const firefoxBackgroundJs = () => backgroundJs('firefox');
const firefoxInjectJs = () => injectJs('firefox');

gulp.task("firefox", gulp.series(firefoxManifest, firefoxBackgroundJs, firefoxHtml, firefoxLocales, firefoxIcons, firefoxSettingsJs, firefoxPopupJs, firefoxCss, firefoxInjectJs));
gulp.task("firefox:popup", gulp.series(firefoxManifest, firefoxHtml, firefoxCss, firefoxLocales, firefoxPopupJs));
gulp.task("firefox:background", gulp.series(firefoxManifest, firefoxHtml, firefoxCss, firefoxLocales, firefoxBackgroundJs));
gulp.task("firefox:settings", gulp.series(firefoxManifest, firefoxHtml, firefoxCss, firefoxLocales, firefoxSettingsJs));

///
// Main
///

gulp.task("default", gulp.series("clean", "chrome", "firefox"));
