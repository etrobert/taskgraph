import React from "../snowpack/pkg/react.js";
import "./Toolbar.css.proxy.js";
const Toolbar = (props) => {
  const renderButtons = () => {
    if (!props.tasksSelected) {
      const {linkMode, onChangeLinkMode, onCreateTask} = props;
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
        "aria-label": "Change Link Mode",
        onClick: onChangeLinkMode,
        className: `
              Toolbar__button
              Toolbar__button-change-link-mode
              ${linkMode ? "Toolbar__button-change-link-mode--active" : ""}
              iconButton
            `
      }), /* @__PURE__ */ React.createElement("button", {
        "aria-label": "Create Task",
        onClick: onCreateTask,
        className: "Toolbar__button Toolbar__button-create-task iconButton"
      }));
    }
    const {onComplete, onDelete} = props;
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
      "aria-label": "Delete Selected",
      onClick: onDelete,
      className: "Toolbar__button Toolbar__button-delete-selected iconButton"
    }), /* @__PURE__ */ React.createElement("button", {
      "aria-label": "Complete Selected",
      onClick: onComplete,
      className: "Toolbar__button Toolbar__button-complete-selected iconButton"
    }));
  };
  return /* @__PURE__ */ React.createElement("div", {
    className: "Toolbar"
  }, renderButtons(), /* @__PURE__ */ React.createElement("input", {
    style: {display: "none"},
    type: "checkbox",
    checked: !props.tasksSelected && props.linkMode,
    id: "linkModeCheckbox",
    readOnly: true
  }));
};
export default Toolbar;
