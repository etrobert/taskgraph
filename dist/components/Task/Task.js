import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import {taskSelectedStateFamily, taskStateFamily} from "../../atoms.js";
import classNames from "../../classNames.js";
import "./Task.css.proxy.js";
const Task = ({id, cy, edgeHandles}) => {
  const {name, status} = useRecoilValue(taskStateFamily(id));
  const selected = useRecoilValue(taskSelectedStateFamily(id));
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames([
      "Task",
      status === "completed" && "Task--completed",
      selected && "Task--selected"
    ]),
    id
  }, name, /* @__PURE__ */ React.createElement("div", {
    className: "Task__handle",
    onPointerDown: () => {
      if (cy === void 0 || edgeHandles === void 0)
        return;
      const node = cy.$(`#${id}`);
      node.ungrabify();
      cy.userPanningEnabled(false);
      edgeHandles.start(node);
    }
  }));
};
export default Task;
