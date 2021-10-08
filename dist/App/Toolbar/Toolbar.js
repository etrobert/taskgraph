import React from "../../../_snowpack/pkg/react.js";
import NoneSelectedButtons from "./NoneSelectedButtons/NoneSelectedButtons.js";
import SomeSelectedButtons from "./SomeSelectedButtons/SomeSelectedButtons.js";
import "./Toolbar.css.proxy.js";
const Toolbar = ({
  tasksSelected,
  onCreateTask,
  onComplete,
  onDelete
}) => /* @__PURE__ */ React.createElement("div", {
  className: "Toolbar"
}, tasksSelected ? /* @__PURE__ */ React.createElement(SomeSelectedButtons, {
  onComplete,
  onDelete
}) : /* @__PURE__ */ React.createElement(NoneSelectedButtons, {
  onCreateTask
}));
export default Toolbar;
