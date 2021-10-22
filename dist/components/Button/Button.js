import React from "../../../_snowpack/pkg/react.js";
import classNames from "../../../_snowpack/pkg/classnames.js";
import "./Button.css.proxy.js";
const Button = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ React.createElement("button", {
    className: classNames("Button", className),
    ...props
  });
};
export default Button;
