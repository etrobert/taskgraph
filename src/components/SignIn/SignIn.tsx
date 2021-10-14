import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { FirebaseError } from "@firebase/util";

import AuthPage from "@/components/AuthPage/AuthPage";
import Button from "@/components/Button/Button";
import TextInput from "@/components/TextInput/TextInput";

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
        <TextInput
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
        />
        <TextInput
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {error}
        <Button type="submit">Sign In</Button>
      </form>
    </AuthPage>
  );
};

export default SignIn;
