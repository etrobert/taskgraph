import React from "react";

import Button from "@/components/Button/Button";
import TextInput from "@/components/TextInput/TextInput";

import "./LandingPage.css";

const LandingPage = (): JSX.Element => {
  return (
    <div className="LandingPage">
      <h1 className="LandingPage__title">
        Task
        <br />
        Graph
      </h1>

      <form
        action="https://gmail.us5.list-manage.com/subscribe/post?u=fcf0ac58a5bd4d1fe9162f855&amp;id=389c9dac43"
        method="post"
        id="mc-embedded-subscribe-form"
        name="mc-embedded-subscribe-form"
        target="_blank"
        className="LandingPage__form"
        noValidate
      >
        <label htmlFor="mce-EMAIL">
          <h2>Get our Latest Updates</h2>
        </label>
        <TextInput
          type="email"
          name="EMAIL"
          className="LandingPage__email-input"
          id="mce-EMAIL"
          placeholder="email address"
          required
        />
        {/* real people should not fill this in and expect good things - do not remove this or risk form bot signups */}
        <div
          style={{ position: "absolute", left: "-5000px" }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="b_fcf0ac58a5bd4d1fe9162f855_389c9dac43"
            tabIndex={-1}
          />
        </div>
        <Button type="submit">Subscribe</Button>
      </form>
    </div>
  );
};
export default LandingPage;
