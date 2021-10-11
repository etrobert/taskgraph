import React from "react";

import "./Button.css";

import type { ButtonHTMLAttributes } from "react";

const Button = ({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>): JSX.Element => {
  return <button className={`Button ${className}`} {...props} />;
};

export default Button;
