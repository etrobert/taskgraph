import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import Button from "@/components/Button/Button";

import "./SignUp.css";
import AuthPage from "../AuthPage/AuthPage";

const auth = getAuth();

const SignUp = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const createAccount = () =>
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
        console.log("Signed in ", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
        console.log("Error", errorCode, errorMessage);
      });

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
        <Button type="submit">Sign Up</Button>
      </form>
    </AuthPage>
  );
};

export default SignUp;
