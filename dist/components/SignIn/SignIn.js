import React, {useState} from "../../../_snowpack/pkg/react.js";
import {getAuth, signInWithEmailAndPassword} from "../../../_snowpack/pkg/firebase/auth.js";
import {FirebaseError} from "../../../_snowpack/pkg/@firebase/util.js";
import AuthPage from "../AuthPage/AuthPage.js";
import Button from "../Button/Button.js";
import TextInput from "../TextInput/TextInput.js";
import "./SignIn.css.proxy.js";
const auth = getAuth();
const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  return /* @__PURE__ */ React.createElement(AuthPage, null, /* @__PURE__ */ React.createElement("h1", null, "Sign In"), /* @__PURE__ */ React.createElement("form", {
    className: "SignIn__form",
    onSubmit: async (e) => {
      e.preventDefault();
      try {
        await signInWithEmailAndPassword(auth, email, password);
        window.location.href = "/graph";
      } catch (error2) {
        if (error2 instanceof FirebaseError)
          setError(error2.message);
      }
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
  }, "Sign In")));
};
export default SignIn;
