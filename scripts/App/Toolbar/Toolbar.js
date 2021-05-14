import React from "../../../snowpack/pkg/react.js";
import NoneSelectedButtons from "./NoneSelectedButtons.js";
import SomeSelectedButtons from "./SomeSelectedButtons.js";
import "./Toolbar.css.proxy.js";
const Toolbar = ({
  tasksSelected,
  linkMode,
  onChangeLinkMode,
  onCreateTask,
  onComplete,
  onDelete
}) => /* @__PURE__ */ React.createElement("div", {
  className: "Toolbar"
}, tasksSelected ? /* @__PURE__ */ React.createElement(SomeSelectedButtons, {
  onComplete,
  onDelete
}) : /* @__PURE__ */ React.createElement(NoneSelectedButtons, {
  linkMode,
  onChangeLinkMode,
  onCreateTask
}), /* @__PURE__ */ React.createElement("input", {
  style: {display: "none"},
  type: "checkbox",
  checked: !tasksSelected && linkMode,
  id: "linkModeCheckbox",
  readOnly: true
}));
export default Toolbar;
