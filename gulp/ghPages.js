"use strict";

import { config } from "./config.js";
import path from "path";
import ghPages from "gh-pages";
import chalk from "chalk";

export function deploy(cb) {
  console.log("[ ", chalk.yellow("wait"), ` ] Waiting build folder before deploying (${config.deployTimeOut})`);
  setTimeout(() => {
    console.log("[", chalk.yellow("deploy"), `] Deploying gh-pages`);
    ghPages.publish(path.join(process.cwd(), config.to.root), {}, cb).then();
  }, config.deployTimeOut);
}
