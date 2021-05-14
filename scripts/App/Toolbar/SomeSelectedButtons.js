import React from "../../../snowpack/pkg/react.js";
const SomeSelectedButtons = ({onComplete, onDelete}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
  "aria-label": "Delete Selected",
  onClick: onDelete,
  className: "Toolbar__button Toolbar__button-delete-selected iconButton"
}), /* @__PURE__ */ React.createElement("button", {
  "aria-label": "Complete Selected",
  onClick: onComplete,
  className: "Toolbar__button Toolbar__button-complete-selected iconButton"
}));
export default SomeSelectedButtons;
