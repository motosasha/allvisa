import { config } from "./utils/bundleConfig.js";
import { ready } from "./utils/documentReady.js";

ready(function () {
  if (config.getScrollSize) {
    // Adding a custom property with a system scroll width
    import("./utils/getScrollSize.js").then(({ default: getScrollSize }) => {
      document.documentElement.style.setProperty("--css-scroll-size", `${getScrollSize()}px`);
    });
  }
});
