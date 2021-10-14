import React from "../../../_snowpack/pkg/react.js";
import "./Button.css.proxy.js";
const Button = ({
  className,
  ...props
}) => {
  return /* @__PURE__ */ React.createElement("button", {
    className: `Button ${className}`,
    ...props
  });
};
export default Button;
