"use strict";

import { watch, series } from "gulp";
import browserSync from "browser-sync";
import path from "path";
import fs from "fs";
import chalk from "chalk";

import { config } from "./config.js";
import { calcGraph } from "./calcGraph.js";
import { pagesCollector } from "./utils/pagesCollector.js";
import {
  pageAdd,
  pageChange,
  pageUnlink,
  templateChange,
  globalStyleChange,
  blockMarkupAdd,
  blockMarkupChange,
  blockMarkupLibraryChange,
  blockStyleAdd,
  blockStyleChange,
  blockUnlink,
  blockImageAdd,
  scriptsGlobalChange,
  scriptsInlineChange,
  sourcesAdd,
  symbolsSprite,
  jsonChange,
  serviceChange,
} from "./utils/watchLog.js";
import { writePugMixinsFile } from "./writePugMixinsFile.js";
import { writeSassImportsFile } from "./writeSassImportsFile.js";
import { writeJsRequiresFile } from "./writeJsRequiresFile.js";
import { compilePug, compilePugFast, compilePugPages } from "./compilePug.js";
import { compileSass } from "./compileSass.js";
import { compileJs, compileInlineJs } from "./compileJs.js";
import { compileJson } from "./compileJson.js";
import { copySources, copyBlockImg } from "./copySources.js";
import { generateSvgSprite } from "./generateSvgSprite.js";

export function server() {
  browserSync.init(config.serverOptions);

  // *
  // Pages =============================================================================================================
  // add
  watch(
    [`${config.from.pages}/**/*.pug`, `${config.from.library}/*.pug`],
    { events: "add", delay: 100 },
    series(pageAdd, calcGraph, writeSassImportsFile, compilePugFast, compileSass, reload),
  );
  // change
  watch(
    [`${config.from.pages}/**/*.pug`, `${config.from.library}/*.pug`, `!${config.from.library}/templates/**/*.pug`],
    { events: "change", delay: 100 },
    series(pageChange, calcGraph, writeSassImportsFile, compilePugFast, compileSass, reload),
  );
  // unlink
  watch([`${config.from.pages}/**/*.pug`], { delay: 100 }).on("unlink", function (filepath) {
    let filePathInBuildDir = filepath.replace(`${config.from.root}/pages/`, config.to.pages).replace(".pug", ".html");
    fs.unlink(filePathInBuildDir, (err) => {
      if (err) throw err;
      pageUnlink(filePathInBuildDir);
      calcGraph();
      writePugMixinsFile();
      writeSassImportsFile();
      compileSass();
    });
    reload();
  });

  // *
  // Templates =========================================================================================================
  const templatesWatcher = watch(
    [
      `${config.from.templates}/**/*.pug`,
      `${config.from.library}/templates/**/*.pug`,
      `!${config.from.templates}/mixins.pug`,
    ],
    { delay: 100 },
  );
  // change
  templatesWatcher.on("change", function (filepath) {
    const rebuildPages = pagesCollector(filepath);
    templateChange(path.basename(filepath, ".pug"));
    calcGraph();
    writePugMixinsFile();
    writeSassImportsFile();
    if (rebuildPages.length) {
      compilePug(rebuildPages);
      compileSass();
    }
    reload();
  });

  // *
  // Service blocks markup =============================================================================================
  // change
  watch(
    [`${config.from.service}/**/*.pug`],
    { events: ["change"], delay: 100 },
    series(serviceChange, compilePugPages, reload),
  );

  // *
  // Global styles =====================================================================================================
  watch(
    [
      `${config.from.style}/**/*.scss`,
      `${config.from.library}/scss/**/*.scss`,
      `!${config.from.style}/style.scss`,
      `!${config.from.library}/scss/library.scss`,
    ],
    { events: ["all"], delay: 100 },
    series(globalStyleChange, compileSass, stream),
  );

  // *
  // Blocks ============================================================================================================
  const blocksWatcher = watch([`${config.from.blocks}/**/*.pug`], {
    delay: 100,
  });

  // markup: add
  blocksWatcher.on("add", function (filepath) {
    const rebuildPages = pagesCollector(filepath);
    blockMarkupAdd(path.basename(filepath, ".pug"));
    calcGraph();
    writePugMixinsFile();
    if (rebuildPages.length) {
      compilePug(rebuildPages);
    }
    reload();
  });
  // markup: change
  blocksWatcher.on("change", (filepath) => {
    const rebuildPages = pagesCollector(filepath);
    blockMarkupChange(path.basename(filepath, ".pug"));
    calcGraph();
    writePugMixinsFile();
    if (rebuildPages.length) {
      compilePug(rebuildPages);
    }
    reload();
  });

  // markup: library
  watch(
    [`${config.from.library}/blocks/**/*.pug`, `${config.from.library}/edging/**/*.pug`],
    { events: ["add", "change"], delay: 100 },
    series(blockMarkupLibraryChange, writePugMixinsFile, compilePugPages, reload),
  );

  // style: add
  watch(
    [
      `${config.from.blocks}/**/*.scss`,
      `${config.from.library}/blocks/**/*.scss`,
      `${config.from.library}/edging/**/*.scss`,
    ],
    {
      delay: 100,
    },
  ).on("add", function (filepath) {
    blockStyleAdd(path.basename(filepath, ".scss"));
    calcGraph();
    writeSassImportsFile();
    compileSass();
    stream();
  });
  // style: change
  watch(
    [
      `${config.from.blocks}/**/*.scss`,
      `${config.from.library}/blocks/**/*.scss`,
      `${config.from.library}/edging/**/*.scss`,
      `!${config.from.style}/style.scss`,
    ],
    { events: ["change"], delay: 100 },
    series(blockStyleChange, writeSassImportsFile, compileSass, stream),
  );

  // unlink
  watch([`${config.from.blocks}/**/*.*`, `${config.from.library}/blocks/**/*.*`], {
    delay: 100,
  }).on("unlink", function (filepath) {
    const rebuildPages = pagesCollector(filepath);
    blockUnlink(path.basename(filepath));
    calcGraph();
    writePugMixinsFile();
    writeSassImportsFile();
    if (rebuildPages.length) {
      compilePug(rebuildPages);
      compileSass();
    }
    reload();
  });

  // *
  // Global scripts: ===================================================================================================
  // all
  watch(
    [
      `${config.from.js}/**/*.js`,
      `!${config.from.js}/entry.js`,
      `!${config.from.js}/inline/**/*.js`,
      `!${config.from.js}/inlineHeadBundle.js`,
      `${config.from.blocks}/**/*.js`,
      `${config.from.library}/**/*.js`,
    ],
    {
      events: ["all"],
      delay: 100,
    },
    series(scriptsGlobalChange, writeJsRequiresFile, compileJs, reload),
  );

  // *
  // Included scripts: =================================================================================================
  // all
  watch(
    [`${config.from.js}/inline/*.js`, `!${config.from.js}/inline/inlineHeadBundle.js`],
    {
      events: ["all"],
      delay: 100,
    },
    series(calcGraph, scriptsInlineChange, compileInlineJs, compilePugPages, reload),
  );

  // *
  // Copy: =============================================================================================================
  // sources
  watch(
    [
      `${config.from.img}/**/*.{${config.fileFormats}}`,
      `${config.from.img}/favicon/**/*.*`,
      `${config.from.fonts}/**/*.*`,
      `${config.from.assets}/**/*.*`,
    ],
    { events: ["add", "change"], delay: 100 },
    series(sourcesAdd, copySources, reload),
  );
  // images
  watch(
    [`${config.from.blocks}/**/img/**/*.{${config.fileFormats}}`],
    { events: ["add", "change"], delay: 100 },
    series(blockImageAdd, copyBlockImg, reload),
  );

  // *
  // SVG sprite ========================================================================================================
  watch(
    [`${config.from.symbols}/*.svg`, `${config.from.symbols}/svgAsBg.xml`, `${config.from.blocks}/**/symbols/**/*.svg`],
    { events: ["all"], delay: 100 },
    series(symbolsSprite, generateSvgSprite, reload),
  );

  // *
  // JSON ==============================================================================================================
  watch(
    [`${config.from.data}/**/*.json`, `${config.from.library}/data/**/*.json`],
    { events: ["all"], delay: 100 },
    series(jsonChange, compileJson, compilePugPages, reload),
  );
}

function reload(done) {
  browserSync.reload();
  setTimeout(() => {
    console.log(`${chalk.blackBright("---------- -----------------------------------------------------")}`);
  }, config.serverOptions?.reloadDebounce);
  done?.();
}

function stream(done) {
  browserSync.stream();
  setTimeout(() => {
    console.log(`${chalk.blackBright("---------- -----------------------------------------------------")}`);
  }, config.serverOptions?.reloadDebounce);
  done?.();
}
