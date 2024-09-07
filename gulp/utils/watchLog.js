"use strict";

import chalk from "chalk";

export function pageAdd(cb) {
  console.log(`${chalk.bgGreen("[servWtch]")} Pages: new page was added`);
  cb?.();
}

export function pageChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Pages: existing page was changed`);
  cb?.();
}

export function pageUnlink(filepath, cb) {
  console.log(`${chalk.bgRed("[servWtch]")} Pages: page deleted (${chalk.red(filepath)})`);
  cb?.();
}

export function templateChange(filename, cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Templates: template was changed (${chalk.blue(filename)})`);
  cb?.();
}

export function globalStyleChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Global styles: styles was changed`);
  cb?.();
}

export function blockMarkupAdd(filename, cb) {
  console.log(`${chalk.bgGreen("[servWtch]")} Blocks: markup was created (${chalk.green(filename)})`);
  cb?.();
}

export function blockMarkupChange(filename, cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Blocks: markup was changed (${chalk.blue(filename)})`);
  cb?.();
}

export function blockMarkupLibraryChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Library blocks: markup was changed`);
  cb?.();
}

export function blockStyleAdd(filename, cb) {
  console.log(`${chalk.bgGreen("[servWtch]")} Blocks: style was created (${chalk.green(filename)})`);
  cb?.();
}

export function blockStyleChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Blocks: style was changed`);
  cb?.();
}

export function blockUnlink(filename, cb) {
  console.log(`${chalk.bgRed("[servWtch]")} Blocks: file was deleted (${chalk.red(filename)})`);
  cb?.();
}

export function blockImageAdd(cb) {
  console.log(`${chalk.bgGreen("[servWtch]")} Blocks: image was added`);
  cb?.();
}

export function scriptsGlobalChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Scripts: global script was changed`);
  cb?.();
}

export function scriptsInlineChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Scripts: inline script was changed`);
  cb?.();
}

export function sourcesAdd(cb) {
  console.log(`${chalk.bgGreen("[servWtch]")} Sources: file was added`);
  cb?.();
}

export function symbolsSprite(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Sprite: symbols was changed`);
  cb?.();
}

export function jsonChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} JSON: markup data was changed`);
  cb?.();
}

export function serviceChange(cb) {
  console.log(`${chalk.bgBlueBright("[servWtch]")} Service: markup was changed`);
  cb?.();
}
