import React from "react";

import "./LandingPage.css";

const LandingPage = (): JSX.Element => {
  // TODO: Use the real CTA
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onCtaClick = () => {};

  return (
    <div className="LandingPage">
      <h1 className="LandingPage__title">
        Task
        <br />
        Graph
      </h1>
      <button className={"LandingPage__cta"} onClick={onCtaClick}>
        START NOW
      </button>
    </div>
  );
};
export default LandingPage;
