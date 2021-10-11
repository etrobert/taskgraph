import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import Button from "@/components/Button/Button";

import "./Auth.css";

const auth = getAuth();

type Props = {
  mode: "signup" | "signin";
};

/**
 * Design from https://codepen.io/FlorinPop17/pen/vPKWjd
 */
const Auth = ({ mode }: Props): JSX.Element => {
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
    <div className="Auth">
      <div className="Auth__container">
        <h1>Sign in</h1>
        <form className="Auth__form">
          <input type="email" />
          <input type="password" />
          <Button type="submit">Sign In</Button>
        </form>
      </div>
    </div>
  );
};

export default Auth;
