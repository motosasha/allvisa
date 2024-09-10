import { ready } from "../../js/utils/documentReady.js";

ready(function () {
  const pageHeader = document.querySelector(".header");

  if (pageHeader) {
    const headerLogo = pageHeader.querySelector(".header__logo");
    headerLogo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (document.body.getAttribute("data-state") === "open-nav") {
        document.body.dataset.state = "";
      }
    });
  }
});
