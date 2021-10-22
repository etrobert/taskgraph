import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import classNames from "../../../_snowpack/pkg/classnames.js";
import {Link} from "../../../_snowpack/pkg/react-router-dom.js";
import {taskSelectedStateFamily, taskStateFamily} from "../../atoms.js";
import "./Task.css.proxy.js";
const Task = ({id, cy, edgeHandles}) => {
  const {name, status} = useRecoilValue(taskStateFamily(id));
  const selected = useRecoilValue(taskSelectedStateFamily(id));
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames("Task", {
      "Task--completed": status === "completed",
      "Task--selected": selected
    }),
    id
  }, name, /* @__PURE__ */ React.createElement(Link, {
    className: "iconButton Task__edit-button",
    to: `/task/${id}`
  }), /* @__PURE__ */ React.createElement("div", {
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
