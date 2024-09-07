"use strict";

import path from "path";
import { config } from "./config.js";
import { src, dest } from "gulp";
import concat from "gulp-concat";
import minify from "gulp-minifier";
import rollupStream from "@rollup/stream";
import resolve from "@rollup/plugin-node-resolve";
import rollupReplace from "@rollup/plugin-replace";
import babel from "@rollup/plugin-babel";
import multi from "@rollup/plugin-multi-entry";
import terser from "@rollup/plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import source from "vinyl-source-stream";

export function compileJs(cb) {
  const babelConfig = {
    babelHelpers: "runtime",
    presets: ["@babel/preset-env"],
    plugins: ["@babel/plugin-transform-runtime"],
    exclude: ["**/node_modules/**"],
  };

  for (const entry of config.jsScripts) {
    let fileName = path.basename(entry, ".js");
    if (fileName === "entry") fileName = "bundle";

    rollupStream({
      input: entry,
      output: {
        inlineDynamicImports: true,
        file: `${config.to.js}/${fileName}.js`,
        format: "esm",
        name: fileName,
        sourcemap: config.mode === "development",
      },
      plugins: [
        multi(),
        resolve(),
        rollupReplace({
          preventAssignment: true,
          values: {
            "process.env.NODE_ENV": JSON.stringify(config.mode),
          },
        }),
        config.mode !== "development" &&
          terser({
            format: {
              comments: false,
            },
            compress: false,
          }),
        babel(babelConfig),
        commonjs(),
      ],
    })
      .on("error", function (err) {
        console.log("Error : " + err.message);
        this.emit("end");
      })
      .pipe(source(`${fileName}.js`))
      .pipe(dest(config.to.js));
  }

  cb?.();
}

export function compileInlineJs(cb) {
  const options = config.inlineHeadScriptOptions;
  const workingList = [];
  const fileList = [];

  for (const entry of Object.keys(options)) {
    workingList.push(`${config.from.js}/inline/${entry}.js`);
  }

  workingList.forEach((file) => {
    if (options[path.basename(file, ".js")]) fileList.push(`${file}`);
  });

  src(fileList)
    .pipe(concat(`inlineHeadBundle.js`))
    .pipe(
      minify({
        minify: true,
        minifyJS: {
          sourceMap: false,
        },
      }),
    )
    .pipe(dest(`${config.from.js}`));

  cb?.();
}
