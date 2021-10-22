import React from "../../../_snowpack/pkg/react.js";
import classNames from "../../../_snowpack/pkg/classnames.js";
import "./TextInput.css.proxy.js";
const TextInput = ({className, ...props}) => /* @__PURE__ */ React.createElement("input", {
  type: "text",
  className: classNames("TextInput", className),
  ...props
});
export default TextInput;
