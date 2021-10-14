import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { FirebaseError } from "@firebase/util";

import AuthPage from "../AuthPage/AuthPage";
import Button from "../Button/Button";

import "./SignIn.css";

const auth = getAuth();

const SignIn = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  return (
    <AuthPage>
      <h1>Sign In</h1>
      <form
        className="SignIn__form"
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            await signInWithEmailAndPassword(auth, email, password);
            window.location.href = "/graph";
          } catch (error) {
            if (error instanceof FirebaseError) setError(error.message);
          }
        }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error}
        <Button type="submit">Sign In</Button>
      </form>
    </AuthPage>
  );
};

export default SignIn;
