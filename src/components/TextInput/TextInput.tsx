import React from "react";
import classNames from "classnames";

import "./TextInput.css";

import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

const TextInput = ({ className, ...props }: Props): JSX.Element => (
  <input
    type="text"
    className={classNames("TextInput", className)}
    {...props}
  />
);

export default TextInput;
