import { ready } from "../../js/utils/documentReady.js";
import { openNav } from "../../js/common/openNav.js";

ready(function () {
  const pageHeader = document.querySelector(".header");

  if (pageHeader) {
    const headerBurger = pageHeader.querySelector(".header__burger");
    headerBurger.addEventListener("click", () => {
      openNav(document.body, "open-nav");
    });

    const headerLogo = pageHeader.querySelector(".header__logo");
    headerLogo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (document.body.getAttribute("data-state") === "open-nav") {
        document.body.dataset.state = "";
      }
    });
  }
});
