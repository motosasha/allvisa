"use strict";

import fs from "fs";
import chalk from "chalk";

import { config } from "./config.js";
import { fileExist } from "./utils/fileExist.js";
import { getArraysDiff } from "./utils/getArraysDiff.js";
import { getDirectories } from "./utils/getDirectories.js";

config.scssImportsList = [];

export function writeSassImportsFile(cb) {
  const newScssImportsList = [];
  config.addStyleBefore.forEach(function (src) {
    newScssImportsList.push(src);
  });
  config.alwaysAddBlocks.forEach(function (blockName) {
    if (fileExist(`${config.from.blocks}/${blockName}/${blockName}.scss`)) {
      newScssImportsList.push(`${config.from.blocks}/${blockName}/${blockName}.scss`);
    }
  });
  let allBlocksWithScssFiles = getDirectories(`${config.from.blocks}/`, "scss");
  allBlocksWithScssFiles.forEach(function (blockWithScssFile) {
    let url = `${config.from.blocks}/${blockWithScssFile}/${blockWithScssFile}.scss`;
    if (config.blocksFromHtml.indexOf(blockWithScssFile) === -1) return;
    if (config.movedStyles.indexOf(blockWithScssFile) !== -1) return;
    if (newScssImportsList.indexOf(url) > -1) return;
    newScssImportsList.push(url);
  });
  config.addStyleAfter.forEach(function (src) {
    newScssImportsList.push(src);
  });
  let diff = getArraysDiff(newScssImportsList, config.scssImportsList);
  if (diff.length) {
    let msg = `\n/* !*${config.doNotEditMsg.replace(/\n /gm, "\n * ").replace(/\n\n$/, "\n */\n\n")}`;
    let styleImports = msg;
    newScssImportsList.forEach(function (src) {
      styleImports += `@use "${src}";\n`;
    });
    styleImports += msg;
    fs.writeFileSync(`${config.from.style}/style.scss`, styleImports);
    console.log("[", chalk.yellow("action"), `] Write new style sheet: style.scss`);
    config.scssImportsList = newScssImportsList;
  }

  if (process.env.BUILD_LIBRARY) {
    writeLibraryImportsFile();
  }
  cb?.();
}

export function writeLibraryImportsFile(cb) {
  const newLibraryImportsList = [
    `${config.from.library}/scss/library-variables.scss`,
    `${config.from.library}/scss/library-reboot.scss`,
  ];
  let allBlocksWithScssFiles = getDirectories(`${config.from.library}/blocks/`, "scss");
  allBlocksWithScssFiles.forEach(function (blockWithScssFile) {
    let url = `${config.from.library}/blocks/${blockWithScssFile}/${blockWithScssFile}.scss`;
    if (newLibraryImportsList.indexOf(url) > -1) return;
    newLibraryImportsList.push(url);
  });
  let edgingBlocksWithScssFiles = getDirectories(`${config.from.library}/edging/`, "scss");
  edgingBlocksWithScssFiles.forEach(function (blockWithScssFile) {
    let url = `${config.from.library}/edging/${blockWithScssFile}/${blockWithScssFile}.scss`;
    if (newLibraryImportsList.indexOf(url) > -1) return;
    newLibraryImportsList.push(url);
  });
  let msg = `\n/* !*${config.doNotEditMsg.replace(/\n /gm, "\n * ").replace(/\n\n$/, "\n */\n\n")}`;
  let styleImports = msg;
  newLibraryImportsList.forEach(function (src) {
    styleImports += `@use "${src}";\n`;
  });
  styleImports += msg;
  fs.writeFileSync(`${config.from.library}/scss/library.scss`, styleImports);
  console.log("[", chalk.yellow("action"), `] Write new library style sheet: library.scss`);
  cb?.();
}
