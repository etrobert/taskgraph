import React, {useState} from "../../../_snowpack/pkg/react.js";
import {getAuth, createUserWithEmailAndPassword} from "../../../_snowpack/pkg/firebase/auth.js";
import {FirebaseError} from "../../../_snowpack/pkg/@firebase/util.js";
import AuthPage from "../AuthPage/AuthPage.js";
import Button from "../Button/Button.js";
import TextInput from "../TextInput/TextInput.js";
import createNewWorkspace from "../../createNewWorkspace.js";
import "./SignUp.css.proxy.js";
const auth = getAuth();
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState();
  const createAccount = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await createNewWorkspace(userCredential.user.uid);
      window.location.href = "/graph";
    } catch (error2) {
      if (error2 instanceof FirebaseError)
        setError(error2.message);
    }
  };
  return /* @__PURE__ */ React.createElement(AuthPage, null, /* @__PURE__ */ React.createElement("h1", null, "Sign Up"), /* @__PURE__ */ React.createElement("form", {
    className: "SignUp__form",
    onSubmit: (e) => {
      e.preventDefault();
      createAccount();
    }
  }, /* @__PURE__ */ React.createElement(TextInput, {
    type: "email",
    value: email,
    onChange: (e) => setEmail(e.target.value),
    placeholder: "Email Address"
  }), /* @__PURE__ */ React.createElement(TextInput, {
    type: "password",
    value: password,
    onChange: (e) => setPassword(e.target.value),
    placeholder: "Password"
  }), error, /* @__PURE__ */ React.createElement(Button, {
    type: "submit"
  }, "Sign Up")));
};
export default SignUp;
