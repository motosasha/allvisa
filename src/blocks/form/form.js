import { ready } from "../../js/utils/documentReady.js";
import JustValidate from "just-validate";

const validationFormConfig = {
  errorFieldCssClass: "input--invalid",
  errorLabelStyle: {},
  errorLabelCssClass: ["form__field-error"],
};

ready(function () {
  const form = document.querySelector("#calculatorForm");

  if (form) {
    const actionUrl = form.getAttribute("action");
    const formValidate = new JustValidate(form, validationFormConfig);

    const formButtonForward = form.querySelector("button[data-action='forward']");
    const formButtonBack = form.querySelector("button[data-action='back']");
    const formButtonSubmit = form.querySelector("button[data-action='submit']");
    let currentStep = 1;

    formButtonForward.addEventListener("click", function (e) {
      e.preventDefault();
      form.dataset.steps = (++currentStep).toString();
      if (currentStep > 1) formButtonBack.removeAttribute("disabled");
      if (currentStep === 5) {
        formButtonForward.setAttribute("hidden", "true");
        formButtonSubmit.removeAttribute("hidden");
      }
    });

    formButtonBack.addEventListener("click", function (e) {
      e.preventDefault();
      form.dataset.steps = (--currentStep).toString();
      if (currentStep === 1) formButtonBack.setAttribute("disabled", "true");
      if (currentStep < 5) {
        formButtonForward.removeAttribute("hidden");
        formButtonSubmit.setAttribute("hidden", "true");
      }
    });

    formValidate
      .addField("input[name='name']", [
        {
          rule: "required",
          errorMessage: "Обязательное поле",
        },
        {
          rule: "minLength",
          value: 2,
          errorMessage: "Значение слишком короткое",
        },
        {
          rule: "maxLength",
          value: 50,
          errorMessage: "Значение слишком длинное",
        },
      ])
      .addField("input[name='phone']", [
        {
          rule: "required",
          errorMessage: "Обязательное поле",
        },
        {
          rule: "customRegexp",
          value: /^(\+7)[\s-]\(([0-9]{3})\)[\s-]([0-9]{3})[\s-]([0-9]{2})[\s-]([0-9]{2})/gi,
          errorMessage: "Неверное значение",
        },
      ])
      .addField("input[name='email']", [
        {
          rule: "required",
          errorMessage: "Обязательное поле",
        },
        {
          rule: "email",
          errorMessage: "Неверное значение",
        },
      ])
      .onSuccess(() => {
        const formData = new FormData(form);
        const plainFormData = Object.fromEntries(formData.entries());
        fetch(actionUrl, formSendConfig(plainFormData)).then((response) => {
          if (response.ok) {
            form.dataset.steps = (++currentStep).toString();
          } else {
            alert("Ошибка! Попробуйте повторить отправку формы позже.");
          }
        });
      });
  }
});

function formSendConfig(plainFormData) {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(plainFormData),
  };
}
