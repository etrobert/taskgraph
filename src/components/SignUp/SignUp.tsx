import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "@firebase/util";

import AuthPage from "@/components/AuthPage/AuthPage";
import Button from "@/components/Button/Button";
import TextInput from "@/components/TextInput/TextInput";
import createNewWorkspace from "@/createNewWorkspace";

import "./SignUp.css";

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
      window.location.href = "/";
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
        <Button type="submit">Sign Up</Button>
      </form>
    </AuthPage>
  );
};

export default SignUp;
