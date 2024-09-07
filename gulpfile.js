"use strict";

import { series, parallel, task } from "gulp";
import { writePugMixinsFile } from "./gulp/writePugMixinsFile.js";
import { writeSassImportsFile } from "./gulp/writeSassImportsFile.js";
import { writeJsRequiresFile } from "./gulp/writeJsRequiresFile.js";
import { compilePug, compilePugFast } from "./gulp/compilePug.js";
import { compileSass } from "./gulp/compileSass.js";
import { compileJs, compileInlineJs } from "./gulp/compileJs.js";
import { compileJson } from "./gulp/compileJson.js";
import { generateSvgSprite } from "./gulp/generateSvgSprite.js";
import { copySources, copyBlockImg } from "./gulp/copySources.js";
import { clearBuildDir } from "./gulp/clearBuildDir.js";
import { calcGraph } from "./gulp/calcGraph.js";
import { deploy } from "./gulp/ghPages.js";
import { server } from "./gulp/server.js";

task("compile:pugMixin", writePugMixinsFile);
task("compile:sassImports", writeSassImportsFile);
task("compile:jsRequires", writeJsRequiresFile);
task("compile:pug", compilePug);
task("compile:pugFast", compilePugFast);
task("compile:sass", compileSass);
task("compile:js", compileJs);
task("compile:inlineJs", compileInlineJs);
task("compile:json", compileJson);
task("compile:svgSprite", generateSvgSprite);
task("copy:sources", copySources);
task("copy:blockImg", copyBlockImg);
task("dev:clear", clearBuildDir);
task("dev:graph", calcGraph);
task("dev:deploy", deploy);
task("dev:server", server);

task(
  "default",
  series(
    parallel("dev:clear", "dev:graph"),
    parallel("compile:pugMixin", "compile:inlineJs", "compile:sassImports", "compile:jsRequires", "compile:json"),
    parallel("compile:pugFast", "compile:sass", "compile:js"),
    parallel("copy:sources", "copy:blockImg", "compile:svgSprite"),
    "dev:server",
  ),
);

task(
  "build",
  series(
    parallel("dev:clear", "dev:graph"),
    parallel("compile:pugMixin", "compile:inlineJs", "compile:sassImports", "compile:jsRequires", "compile:json"),
    parallel("compile:pugFast", "compile:sass", "compile:js"),
    parallel("copy:sources", "copy:blockImg", "compile:svgSprite"),
  ),
);

task(
  "deploy",
  series(
    parallel("dev:clear", "dev:graph"),
    parallel("compile:pugMixin", "compile:inlineJs", "compile:sassImports", "compile:jsRequires", "compile:json"),
    parallel("compile:pugFast", "compile:sass", "compile:js"),
    parallel("copy:sources", "copy:blockImg", "compile:svgSprite"),
    "dev:deploy",
  ),
);
