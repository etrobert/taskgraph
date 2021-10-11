import React, { PropsWithChildren } from "react";

import "./AuthPage.css";

const AuthPage = ({
  children,
}: PropsWithChildren<Record<string, unknown>>): JSX.Element => (
  <div className="AuthPage">
    <div className="AuthPage__container">{children}</div>
  </div>
);

export default AuthPage;
