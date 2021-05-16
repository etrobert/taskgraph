import React from "../../../snowpack/pkg/react.js";
const NotSelectedButtons = ({
  linkMode,
  onChangeLinkMode,
  onCreateTask
}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
  "aria-label": "Change Link Mode",
  onClick: onChangeLinkMode,
  className: `
        Toolbar__button
        Toolbar__button-change-link-mode
        ${linkMode ? "Toolbar__button-change-link-mode--active" : ""}
        iconButton
      `
}), /* @__PURE__ */ React.createElement("button", {
  "aria-label": "Create Task",
  onClick: onCreateTask,
  className: "Toolbar__button Toolbar__button-create-task iconButton"
}));
export default NotSelectedButtons;
