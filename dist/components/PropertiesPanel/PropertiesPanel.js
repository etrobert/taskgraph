import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import {deleteField} from "../../../_snowpack/pkg/@firebase/firestore.js";
import {selectedElementsState, taskStateFamily} from "../../atoms.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import "./PropertiesPanel.css.proxy.js";
const PropertiesPanel = () => {
  const {tasks} = useRecoilValue(selectedElementsState);
  const noTaskSelected = tasks.size === 0;
  const id = tasks.first("NO-TASK");
  const {name, priority} = useRecoilValue(taskStateFamily(id));
  const {updateTask} = useFirestoreState();
  return /* @__PURE__ */ React.createElement("div", {
    className: "PropertiesPanel"
  }, /* @__PURE__ */ React.createElement("h1", null, noTaskSelected ? "No Task Selected" : name), noTaskSelected || /* @__PURE__ */ React.createElement("label", null, "Priority:", " ", /* @__PURE__ */ React.createElement("select", {
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
  }, "Very High"))));
};
export default PropertiesPanel;
