import { ready } from "../../../js/utils/documentReady.js";

ready(function () {
  const libraryTabs = document.querySelector(".library-tabs");

  if (libraryTabs) {
    const libraryTabsButtons = libraryTabs.querySelectorAll(".library-tabs__button");
    const libraryTabsPanels = libraryTabs.querySelectorAll(".library-tabs__panel");

    libraryTabsButtons.forEach((button) => {
      const tabButtonTarget = button.dataset.tabButton;

      button.addEventListener("click", function () {
        libraryTabsButtons.forEach((button) => {
          button.dataset.tabButtonState = "";
        });

        button.dataset.tabButtonState = "active";

        libraryTabsPanels.forEach((panel) => {
          if (panel.dataset.tabPanel === tabButtonTarget) {
            panel.scrollTop = 0;
            panel.dataset.tabPanelState = "active";
          } else {
            panel.dataset.tabPanelState = "";
          }
        });
      });
    });
  }
});
