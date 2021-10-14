import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";

import Button from "@/components/Button/Button";
import createNewWorkspace from "@/createNewWorkspace";

import "./SignUp.css";
import AuthPage from "../AuthPage/AuthPage";

const auth = getAuth();

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string>();

  const createAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await createNewWorkspace(userCredential.user.uid);
      window.location.href = "/graph";
    } catch (error) {
      if (error instanceof FirebaseError) setError(error.message);
    }
  };

  return (
    <AuthPage>
      <h1>Sign Up</h1>
      <form
        className="SignUp__form"
        onSubmit={(e) => {
          e.preventDefault();
          createAccount();
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
        <Button type="submit">Sign Up</Button>
      </form>
    </AuthPage>
  );
};

export default SignUp;
