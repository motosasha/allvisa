"use strict";

import fs from "fs";

import { config } from "./config.js";
import { getDirectories } from "./utils/getDirectories.js";

export function writePugMixinsFile(cb) {
  let allBlocksWithPugFiles = getDirectories(`${config.from.blocks}/`, "pug");
  let pugMixins = "//-" + config.doNotEditMsg;
  allBlocksWithPugFiles.forEach(function (blockName) {
    pugMixins += `include ${config.from.blocks.replace(config.from.root, "..")}/${blockName}/${blockName}.pug\n`;
  });
  if (config.buildLibrary) {
    let allLibraryBlocksWithPugFiles = getDirectories(`${config.from.library}/blocks/`, "pug");
    allLibraryBlocksWithPugFiles.forEach(function (blockName) {
      pugMixins += `include ${config.from.library.replace(config.from.root, "..")}/blocks/${blockName}/${blockName}.pug\n`;
    });
    let edgingLibraryBlocksWithPugFiles = getDirectories(`${config.from.library}/edging/`, "pug");
    edgingLibraryBlocksWithPugFiles.forEach(function (blockName) {
      pugMixins += `include ${config.from.library.replace(config.from.root, "..")}/edging/${blockName}/${blockName}.pug\n`;
    });
  }
  fs.writeFileSync(`${config.from.templates}/mixins.pug`, pugMixins);
  cb?.();
}
