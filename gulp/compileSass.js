"use strict";

import path from "path";
import gulp from "gulp";
import browserSync from "browser-sync";
import debug from "gulp-debug";
import plumber from "gulp-plumber";
import gulpSass from "gulp-sass";
import postcss from "gulp-postcss";
import atImport from "postcss-import";
import * as nodeSass from "sass";
import autoprefixer from "autoprefixer";
import pxToRem from "postcss-pxtorem";
import sortMediaQueries from "postcss-sort-media-queries";
import removeDuplicateValues from "postcss-remove-duplicate-values";
import replace from "postcss-replace";
import cssnano from "cssnano";

import { fileURLToPath } from "url";
import { config } from "./config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sass = gulpSass(nodeSass);
const { src, dest } = gulp;
const postCssPlugins = [
  atImport(),
  autoprefixer(config.autoprefixerOption),
  pxToRem(config.pxToRemOptions),
  replace({
    commentsOnly: false,
    data: config.paths.style,
    pattern: /{{([A-z]+?)}}/g,
  }),
  removeDuplicateValues({
    preserveEmpty: true,
  }),
  sortMediaQueries({
    sort: config.strategy,
  }),
  cssnano({
    preset: ["default", { discardComments: { removeAll: true } }],
  }),
];

export function compileSass(cb) {
  const fileList = config.styleSheets;
  if (config.buildLibrary) fileList.push(`${config.from.library}/scss/library.scss`);

  if (fileList.length !== 0) {
    return src(fileList, { sourcemaps: true })
      .pipe(
        plumber({
          errorHandler: function (err) {
            console.log(err.message);
            this.emit("end");
          },
        }),
      )
      .pipe(debug({ title: "Compiles:" }))
      .pipe(sass({ includePaths: [__dirname + "/", "node_modules"] }, ""))
      .pipe(postcss(postCssPlugins))
      .pipe(plumber.stop())
      .pipe(dest(config.to.style, { sourcemaps: config.mode !== "production" ? "." : false }))
      .pipe(browserSync.stream());
  } else {
    cb?.();
  }
}
