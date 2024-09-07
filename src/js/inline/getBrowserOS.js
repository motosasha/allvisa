// Browser & OS
const navigatorErrorMessage =
  "Could not find `userAgent` or `userAgentData` window.navigator properties to set `os`, `browser` and `version`";
const removeExcessMozillaAndVersion = /^mozilla\/\d\.\d\W/;
const browserPattern = /(\w+)\/(\d+\.\d+(?:\.\d+)?(?:\.\d+)?)/g;
const engineAndVersionPattern = /^(ver|cri|gec)/;
const brandList = ["chrome", "opera", "safari", "edge", "firefox"];
const unknown = "Unknown";
let userAgentData = window.navigator.userAgentData;
let userAgent = window.navigator.userAgent;
const mobiles = {
  ios: /iphone/,
  ipados: /ipad|macintosh/,
  android: /android/,
};
const desktops = {
  windows: /win/,
  osx: /macintosh/,
  linux: /linux/,
};
const detectPlatform = (customUserAgent, customUserAgentData) => {
  userAgent = typeof customUserAgent === "string" ? customUserAgent : userAgent;
  userAgentData = typeof customUserAgentData === "string" ? customUserAgentData : userAgentData;

  if (userAgent) {
    const ua = userAgent.toLowerCase().replace(removeExcessMozillaAndVersion, "");
    const mobileOS = Object.keys(mobiles).find((os) => mobiles[os].test(ua) && window.navigator.maxTouchPoints >= 1);
    const desktopOS = Object.keys(desktops).find((os) => desktops[os].test(ua));
    const os = mobileOS || desktopOS;
    const browserTest = ua.match(browserPattern);
    const versionRegex = /version\/(\d+(\.\d+)*)/;
    const safariVersion = ua.match(versionRegex);
    const saVersion = Array.isArray(safariVersion) ? safariVersion[1] : null;
    const browserOffset =
      browserTest && (browserTest.length > 2 && !engineAndVersionPattern.test(browserTest[1]) ? 1 : 0);
    const browserResult = browserTest && browserTest[browserTest.length - 1 - (browserOffset || 0)].split("/");
    const browser = browserResult && browserResult[0];
    const version = saVersion ? saVersion : browserResult && browserResult[1];
    return { os, browser, version };
  } else if (userAgentData) {
    const os = userAgentData.platform.toLowerCase();
    let platformData;
    for (const agentBrand of userAgentData.brands) {
      const agentBrandEntry = agentBrand.brand.toLowerCase();
      const foundBrand = brandList.find((brand) => {
        if (agentBrandEntry.includes(brand)) {
          return brand;
        }
      });
      if (foundBrand) {
        platformData = { browser: foundBrand, version: agentBrand.version };
        break;
      }
    }
    const brandVersionData = platformData || { browser: unknown, version: unknown };
    return { os, ...brandVersionData };
  } else {
    console.error(navigatorErrorMessage);
    return {
      os: navigator.platform || unknown,
      browser: unknown,
      version: unknown,
    };
  }
};

let platform = detectPlatform();
document.documentElement.classList.add(platform.os, platform.browser);
