import React from "../../../_snowpack/pkg/react.js";
import classNames from "../../../_snowpack/pkg/classnames.js";
import "./MenuBar.css.proxy.js";
const MenuBar = ({open, onClose}) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames("MenuBar", {"MenuBar--open": open})
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "MenuBar__title"
  }, "TaskGraph"), /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Close Menu",
    className: "MenuBar__close-button iconButton",
    onClick: onClose
  }), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", null, "Keyboard Shortcuts"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, "[I]: [I]nsert a new task"), /* @__PURE__ */ React.createElement("li", null, "[D]/[Delete]: [D]elete selected tasks"))), /* @__PURE__ */ React.createElement("a", {
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
