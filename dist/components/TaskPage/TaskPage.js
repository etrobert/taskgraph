import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import {Link} from "../../../_snowpack/pkg/react-router-dom.js";
import {deleteField} from "../../../_snowpack/pkg/@firebase/firestore.js";
import {taskStateFamily} from "../../atoms.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import "./TaskPage.css.proxy.js";
const TaskPage = ({match}) => {
  const {id} = match.params;
  const {name, priority} = useRecoilValue(taskStateFamily(id));
  const {updateTask} = useFirestoreState();
  return /* @__PURE__ */ React.createElement("div", {
    className: "TaskPage"
  }, /* @__PURE__ */ React.createElement("h1", null, name), /* @__PURE__ */ React.createElement("label", null, "Priority:", " ", /* @__PURE__ */ React.createElement("select", {
    value: priority ?? "",
    onChange: (event) => {
      const value = event.target.value;
      const newPriority = value === "" ? deleteField() : value;
      updateTask(id, {priority: newPriority});
    }
  }, /* @__PURE__ */ React.createElement("option", {
    value: ""
  }), /* @__PURE__ */ React.createElement("option", {
    value: "veryLow"
  }, "Very Low"), /* @__PURE__ */ React.createElement("option", {
    value: "low"
  }, "Low"), /* @__PURE__ */ React.createElement("option", {
    value: "normal"
  }, "Normal"), /* @__PURE__ */ React.createElement("option", {
    value: "high"
  }, "High"), /* @__PURE__ */ React.createElement("option", {
    value: "veryHigh"
  }, "Very High"))), /* @__PURE__ */ React.createElement(Link, {
    className: "TaskPage__close-button iconButton",
    to: "/"
  }));
};
export default TaskPage;
