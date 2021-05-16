import React from "../../../snowpack/pkg/react.js";
import "./MenuBar.css.proxy.js";
const MenuBar = ({
  open,
  onClose,
  onLoad,
  onSave,
  onNewGraph
}) => {
  return /* @__PURE__ */ React.createElement("div", {
    className: `MenuBar ${open ? "MenuBar--open" : ""}`
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "MenuBar__title"
  }, "TaskGraph"), /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Close Menu",
    className: "MenuBar__close-button iconButton",
    onClick: onClose
  }), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", {
    onClick: onSave
  }, "Save")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", {
    onClick: onLoad
  }, "Load")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", {
    onClick: onNewGraph
  }, "New Graph"))), /* @__PURE__ */ React.createElement("section", null, /* @__PURE__ */ React.createElement("h2", null, "Keyboard Shortcuts"), /* @__PURE__ */ React.createElement("ul", null, /* @__PURE__ */ React.createElement("li", null, "[I]: [I]nsert a new task"), /* @__PURE__ */ React.createElement("li", null, "[D]/[Delete]: [D]elete selected tasks"), /* @__PURE__ */ React.createElement("li", null, "[Ctrl+a]: Select [a]ll tasks"), /* @__PURE__ */ React.createElement("li", null, "[Ctrl+s]: [S]ave to file"), /* @__PURE__ */ React.createElement("li", null, "[Ctrl+o]: Load from file"))), /* @__PURE__ */ React.createElement("a", {
    "aria-label": "Github Repository",
    className: "MenuBar__github-link",
    href: "https://github.com/etrobert/taskgraph",
    rel: "noreferrer noopener",
    target: "_blank"
  }), /* @__PURE__ */ React.createElement("p", null, "Made by", /* @__PURE__ */ React.createElement("a", {
    href: "mailto:etiennerobert33@gmail.com",
    target: "_blank",
    rel: "noreferrer"
  }, "Etienne Robert")));
};
export default MenuBar;
