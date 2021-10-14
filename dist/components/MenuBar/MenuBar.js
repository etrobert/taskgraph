import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import {signedInUserIdState} from "../../atoms.js";
import "./MenuBar.css.proxy.js";
import {getAuth} from "../../../_snowpack/pkg/@firebase/auth.js";
const MenuBar = ({open, onClose}) => {
  const signedInUserId = useRecoilValue(signedInUserIdState);
  return /* @__PURE__ */ React.createElement("div", {
    className: `MenuBar ${open ? "MenuBar--open" : ""}`
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "MenuBar__title"
  }, "TaskGraph"), /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Close Menu",
    className: "MenuBar__close-button iconButton",
    onClick: onClose
  }), /* @__PURE__ */ React.createElement("div", {
    className: "MenuBar__auth"
  }, "Signed in as ", signedInUserId, /* @__PURE__ */ React.createElement("button", {
    onClick: () => getAuth().signOut()
  }, "Sign Out")), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", null, "Keyboard Shortcuts"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, "[I]: [I]nsert a new task"), /* @__PURE__ */ React.createElement("li", null, "[D]/[Delete]: [D]elete selected tasks"), /* @__PURE__ */ React.createElement("li", null, "[Ctrl+a]: Select [a]ll tasks"))), /* @__PURE__ */ React.createElement("a", {
    "aria-label": "Github Repository",
    className: "MenuBar__github-link",
    href: "https://github.com/etrobert/taskgraph",
    rel: "noreferrer noopener",
    target: "_blank"
  }), /* @__PURE__ */ React.createElement("p", null, "Made by", /* @__PURE__ */ React.createElement("a", {
    href: "mailto:etiennerobert33@gmail.com",
    target: "_blank",
    rel: "noreferrer"
  }, "Étienne Robert")));
};
export default MenuBar;
