"use strict";

import fs from "fs";

import { fileExist } from "./fileExist.js";
import path from "path";

/**
 * Retrieving all names of subdirectories containing a file of the specified extension that matches
 * the name of the subdirectory
 * @param  {String} source path to directories
 * @param  {String} ext    file extension to be checked
 * @return {Object}        an array of block names
 */
export function getDirectories(source, ext) {
  return fs
    .readdirSync(source)
    .filter((item) => fs.lstatSync(source + item).isDirectory())
    .filter((item) => fileExist(source + item + "/" + item + "." + ext));
}

export function getDeepDirectories(source, ext) {
  const result = [];
  function getFilesWithExt(source, ext) {
    if (!fs.existsSync(source)) return;

    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const filename = path.join(source, file);
      const stat = fs.lstatSync(filename);

      if (stat.isDirectory()) {
        getFilesWithExt(filename, ext);
      } else if (filename.endsWith(ext)) {
        result.push(filename);
      }
    });
  }
  getFilesWithExt(source, ext);
  return result;
}
