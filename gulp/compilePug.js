"use strict";

import { config } from "./config.js";
import { src, dest, lastRun } from "gulp";
import fs from "fs";
import pug from "gulp-pug";
import debug from "gulp-debug";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import prettyHtml from "gulp-pretty-html";
import pugLinter from "gulp-pug-linter";
import pugLintStylish from "puglint-stylish";
import chalk from "chalk";

const {
  buildLibrary,
  includeProjectNav,
  paths: { pug: pugPaths },
  deployUrl,
} = config;
const errorHandler = {
  errorHandler: notify.onError(function (err) {
    return {
      title: "Сборка разметки",
      message: err.message,
    };
  }),
};
const configData = { buildLibrary, includeProjectNav, deployUrl, pugPaths };

export function compilePug(pagesList) {
  pagesList ??= [`${config.from.pages}/**/*.pug`];
  if (config.buildLibrary) pagesList.push(`${config.from.library}/*.pug`);
  return src(pagesList)
    .pipe(plumber(errorHandler))
    .pipe(pugLinter({ reporter: pugLintStylish, silenceOnSuccess: true }))
    .pipe(
      pug({
        data: configData,
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: `[${chalk.blackBright("--------")}] Compiled page(s)` }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}

export function compilePugPages() {
  const pagesList = [`${config.from.pages}/**/*.pug`];
  if (config.buildLibrary) pagesList.push(`${config.from.library}/*.pug`);
  return src(pagesList)
    .pipe(plumber(errorHandler))
    .pipe(pugLinter({ reporter: pugLintStylish, silenceOnSuccess: true }))
    .pipe(
      pug({
        data: configData,
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: `[${chalk.blackBright("--------")}] Compiled page(s)` }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}

export function compilePugFast() {
  const pagesList = [`${config.from.pages}/**/*.pug`];
  if (config.buildLibrary) pagesList.push(`${config.from.library}/*.pug`);
  return src(pagesList, { since: lastRun(compilePugFast) })
    .pipe(plumber(errorHandler))
    .pipe(pugLinter({ reporter: pugLintStylish, silenceOnSuccess: true }))
    .pipe(
      pug({
        data: configData,
        locals: JSON.parse(fs.readFileSync(`${config.from.json}/data.json`, "utf8")),
      }),
    )
    .pipe(prettyHtml(config.prettyOption))
    .pipe(debug({ title: `[${chalk.blackBright("--------")}] Compiled page(s)` }))
    .pipe(plumber.stop())
    .pipe(dest(config.to.pages));
}
