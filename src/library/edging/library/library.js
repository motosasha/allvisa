import { ready } from "../../../js/utils/documentReady.js";
import { openNav } from "../../../js/common/openNav.js";

ready(function () {
  const libraryBlock = document.querySelector(".library");

  if (libraryBlock) {
    const libraryHeader = libraryBlock.querySelector(".library__header");
    const libraryNavTrigger = libraryBlock.querySelector(".library__trigger");

    document.body.addEventListener("click", (e) => {
      if (e.target === libraryNavTrigger) {
        openNav(libraryBlock, "lib-nav-open");
      } else if (!libraryHeader.contains(e.target) && libraryBlock.dataset.state === "lib-nav-open") {
        libraryBlock.dataset.state = "";
      }
    });
  }
});
