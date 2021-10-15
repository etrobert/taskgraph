import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import {anyElementsSelectedState} from "../../atoms.js";
import BaseButtons from "./BaseButtons/BaseButtons.js";
import SomeSelectedButtons from "./SomeSelectedButtons/SomeSelectedButtons.js";
import "./Toolbar.css.proxy.js";
const Toolbar = ({
  onCreateTask,
  onComplete,
  onDelete
}) => {
  const anyElementsSelected = useRecoilValue(anyElementsSelectedState);
  return /* @__PURE__ */ React.createElement("div", {
    className: "Toolbar"
  }, anyElementsSelected && /* @__PURE__ */ React.createElement(SomeSelectedButtons, {
    onComplete,
    onDelete
  }), /* @__PURE__ */ React.createElement(BaseButtons, {
    onCreateTask
  }));
};
export default Toolbar;
