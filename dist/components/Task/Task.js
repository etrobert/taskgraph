import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import classNames from "../../../_snowpack/pkg/classnames.js";
import {
  isNextTaskStateFamily,
  taskSelectedStateFamily,
  taskStateFamily
} from "../../atoms.js";
import "./Task.css.proxy.js";
const Task = ({id, cy, edgeHandles}) => {
  const {name, status, priority} = useRecoilValue(taskStateFamily(id));
  const isNextTask = useRecoilValue(isNextTaskStateFamily(id));
  const selected = useRecoilValue(taskSelectedStateFamily(id));
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames("Task", {
      "Task--completed": status === "completed",
      "Task--selected": selected,
      "Task--next": isNextTask
    }),
    id
  }, priority !== void 0 && /* @__PURE__ */ React.createElement("div", {
    className: classNames("Task__priority", {
      "Task__priority--very-low": priority === "veryLow",
      "Task__priority--low": priority === "low",
      "Task__priority--normal": priority === "normal",
      "Task__priority--high": priority === "high",
      "Task__priority--very-high": priority === "veryHigh"
    })
  }), name, /* @__PURE__ */ React.createElement("div", {
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
