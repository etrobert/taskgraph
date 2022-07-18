import React from "../../../_snowpack/pkg/react.js";
import Button from "../Button/Button.js";
import TextInput from "../TextInput/TextInput.js";
import "./MailchimpForm.css.proxy.js";
const MailchimpForm = () => /* @__PURE__ */ React.createElement("form", {
  action: "https://gmail.us5.list-manage.com/subscribe/post?u=fcf0ac58a5bd4d1fe9162f855&id=389c9dac43",
  method: "post",
  id: "mc-embedded-subscribe-form",
  name: "mc-embedded-subscribe-form",
  target: "_blank",
  className: "MailchimpForm__form",
  noValidate: true
}, /* @__PURE__ */ React.createElement("label", {
  htmlFor: "mce-EMAIL"
}, /* @__PURE__ */ React.createElement("h2", null, "Get our Latest Updates")), /* @__PURE__ */ React.createElement(TextInput, {
  type: "email",
  name: "EMAIL",
  className: "MailchimpForm__email-input",
  id: "mce-EMAIL",
  placeholder: "email address",
  required: true
}), /* @__PURE__ */ React.createElement("div", {
  style: {position: "absolute", left: "-5000px"},
  "aria-hidden": "true"
}, /* @__PURE__ */ React.createElement("input", {
  type: "text",
  name: "b_fcf0ac58a5bd4d1fe9162f855_389c9dac43",
  tabIndex: -1
})), /* @__PURE__ */ React.createElement(Button, {
  type: "submit"
}, "Subscribe"));
export default MailchimpForm;
