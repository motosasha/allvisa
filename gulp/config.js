"use strict";

let userName = `motosasha`;
let projectName = `allvisa`;
let ghPagesUrl = `https://${userName}.github.io/${projectName}/index.html`;

let pathToPrefix = ``;

const htmlPathObj = {
  js: ``,
  css: ``,
  img: ``,
  fonts: ``,
  assets: ``,
};

const cssPathObj = {
  js: ``,
  css: ``,
  img: ``,
  fonts: ``,
  assets: ``,
};

const fromObj = {
  root: "src",
  get pages() {
    return `${this.root}/pages`;
  },
  get templates() {
    return `${this.root}/templates`;
  },
  get blocks() {
    return `${this.root}/blocks`;
  },
  get style() {
    return `${this.root}/scss`;
  },
  get js() {
    return `${this.root}/js`;
  },
  get img() {
    return `${this.root}/img`;
  },
  get assets() {
    return `${this.root}/assets`;
  },
  get fonts() {
    return `${this.root}/fonts`;
  },
  get data() {
    return `${this.root}/data`;
  },
  get json() {
    return `${this.root}/json`;
  },
  get symbols() {
    return `${this.root}/symbols`;
  },
  get library() {
    return `${this.root}/library`;
  },
  get service() {
    return `${this.root}/service`;
  },
};

const toObj = {
  root: "build",
  get pages() {
    return `${this.root}${pathToPrefix}/`;
  },
  get style() {
    return `${this.root}${pathToPrefix}/css`;
  },
  get js() {
    return `${this.root}${pathToPrefix}/js`;
  },
  get img() {
    return `${this.root}${pathToPrefix}/img`;
  },
  get assets() {
    return `${this.root}${pathToPrefix}/assets`;
  },
  get fonts() {
    return `${this.root}${pathToPrefix}/fonts`;
  },
};

const sourcesObj = {
  "src/img/**/*.*": [toObj.img, false],
  "src/favicon/**/*.*": [toObj.img + "/favicon", false],
  "src/assets/**/*.*": [toObj.assets, false],
  "src/fonts/**/*.*": [toObj.fonts, false],
  // "node_modules/somePackage/images/*.{png,svg,jpg,jpeg}": [toObj.img, false],
};

export const config = {
  // where we get the sources from
  from: fromObj,
  // where we put the built project
  to: toObj,

  // graph
  graph: {},

  // paths for markup
  paths: {
    pug: {
      root: "./",
      js: `./${htmlPathObj.js}js/`,
      css: `./${htmlPathObj.css}css/`,
      img: `./${htmlPathObj.img}img/`,
      fonts: `./${htmlPathObj.fonts}fonts/`,
      assets: `./${htmlPathObj.assets}assets/`,
      get icon() {
        return `${this.img}svgSprite.svg?v=${Date.now()}#`;
      },
    },
    style: {
      root: "./",
      js: `./${cssPathObj.js}js/`,
      css: `./${cssPathObj.css}css/`,
      img: `../${cssPathObj.img}img/`,
      fonts: `../${cssPathObj.fonts}fonts/`,
      assets: `./${cssPathObj.assets}assets/`,
      get icon() {
        return `${this.img}svgSprite.svg?v=${Date.now()}#`;
      },
    },
    pages: `/`,
  },

  // sources for copy
  sources: sourcesObj,
  // file format for copy
  fileFormats: `png,jpg,jpeg,svg,gif,webp`,
  // img copy mode
  isSeparatedBlockImg: false, // [false, true, "collected"]

  // excluded blocks
  notGetBlocks: [],
  // ignored blocks
  ignoredBlocks: ["no-js", "content-filler"],
  // always added blocks
  alwaysAddBlocks: [],
  // virtual blocks list
  blocksFromHtml: [],

  // style sheets
  get styleSheets() {
    return [`${this.from.style}/style.scss`];
  },
  // moved styles from main style sheet
  movedStyles: [],
  // style imports at start
  addStyleBefore: [
    "sanitize.css/sanitize.css",
    "sanitize.css/forms.css",
    "sanitize.css/assets.css",
    "sanitize.css/typography.css",
    "sanitize.css/reduce-motion.css",
    "src/scss/variables.scss",
    "src/scss/reboot.scss",
    // "src/scss/mixins.scss",
    // "src/scss/typography.scss",
    // "src/scss/vendor.scss",
    "src/scss/fonts.scss",
    // "src/scss/animations.scss"
    // "somePackage/dist/somePackage.css", // for "node_modules/somePackage/dist/somePackage.css",
  ],
  // style imports at end
  addStyleAfter: [],

  // scripts list
  get jsScripts() {
    return [`${this.from.js}/entry.js`];
  },
  // inline head script options
  inlineHeadScriptOptions: {
    removeNoJs: true,
    getBrowserOS: false,
    isTouch: false,
    vhFix: true,
  },
  // moved scripts from bundle
  movedScripts: [],
  // js imports at start
  addJsBefore: ["./script.js"],
  // js imports at end
  addJsAfter: [
    // "somePackage/dist/somePackage.js", // for "node_modules/somePackage/dist/somePackage.js",
  ],

  // svg attributes to be removed
  removeSvgAttr: ["symbol:width", "symbol:height"], // ["stroke-width"]

  // regexp
  classRegexp: /(?<!(\/\/|=|!=|[({]|include|extends).*)((\.|\B\+)[a-zA-Z0-9-_]+)+?|(class=["']?([\w\-_ ]+)+["']?)/g,
  blockRegexp: /[^\\/]+(?=\.[^.])/g,
  templateRegexp: /(?<=extends.*templates\/).*.pug/g,

  // pretty-html options
  prettyOption: {
    indent_size: 2,
    indent_char: " ",
    indent_inner_html: true,
    indent_scripts: "normal",
    extra_liners: [],
    preserve_newlines: true,
    unformatted: ["code", "em", "strong", "span", "i", "b", "br", "script", "pre"],
  },
  // autoprefixer option
  autoprefixerOption: { flexbox: false, grid: false },
  // pxToRem options
  pxToRemOptions: {
    rootValue: 16,
    unitPrecision: 5,
    propList: ["font", "font-size", "line-height", "letter-spacing"],
    selectorBlackList: [],
    replace: true,
    mediaQuery: false,
    minPixelValue: 0,
  },
  // strategy
  strategy: "mobile-first", // ["mobile-first", "desktop-first"]
  // browserSync options
  serverOptions: {
    server: toObj.root,
    host: "192.168.1.39",
    logPrefix: "dev-serv",
    port: 3000,
    startPath: "index.html",
    open: false,
    notify: true,
    reloadDebounce: 1000,
    reloadOnRestart: true,
    callbacks: {
      ready() {
        console.log(`---------- -----------------------------------------------------`);
      },
    },
  },

  // env mode
  mode: process.env.MODE || "development",
  // library
  buildLibrary: process.env.BUILD_LIBRARY || false,
  // navigation
  includeProjectNav: true,

  // message
  doNotEditMsg: `
  ВНИМАНИЕ! Этот файл генерируется автоматически.
  Любые изменения этого файла будут потеряны при следующей компиляции.
  Любое изменение проекта без возможности компиляции ДОЛЬШЕ И ДОРОЖЕ в 2-5 раз.

`,

  // timeout after build before deploying
  deployTimeOut: 5000,
  // log
  logging: false,
};
