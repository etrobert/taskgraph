import React from "react";
import classNames from "classnames";

import "./Button.css";

import type { ButtonHTMLAttributes } from "react";

const Button = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => {
  return <button className={classNames("Button", className)} {...props} />;
};

export default Button;
