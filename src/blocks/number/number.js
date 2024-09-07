import { ready } from "../../js/utils/documentReady.js";

ready(function () {
  const number = document.querySelector("[data-quantity]");

  if (number) {
    const input = number.querySelector("input");
    const inputMinValue = +input.getAttribute("min");
    const inputMaxValue = +input.getAttribute("max");
    const buttonSub = number.querySelector("button[data-action='sub']");
    const buttonAdd = number.querySelector("button[data-action='add']");

    buttonSub.addEventListener("click", function () {
      if (inputMinValue && +input.value > inputMinValue) {
        input.value = (--input.value).toString();
      }

      if (+input.value === inputMinValue) {
        buttonSub.setAttribute("disabled", "true");
      }

      if (+input.value !== inputMaxValue) {
        buttonAdd.removeAttribute("disabled");
      }
    });

    buttonAdd.addEventListener("click", function () {
      if (inputMaxValue && +input.value < inputMaxValue) {
        input.value = (++input.value).toString();
      }

      if (+input.value !== inputMinValue) {
        buttonSub.removeAttribute("disabled");
      }

      if (+input.value === inputMaxValue) {
        buttonAdd.setAttribute("disabled", "true");
      }
    });
  }
});
