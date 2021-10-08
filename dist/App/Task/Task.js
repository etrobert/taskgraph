import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import {taskSelectedSelectorFamily, taskStateFamily} from "../../atoms.js";
import classNames from "../../classNames.js";
import "./Task.css.proxy.js";
const Task = ({id}) => {
  const {name, status} = useRecoilValue(taskStateFamily(id));
  const selected = useRecoilValue(taskSelectedSelectorFamily(id));
  return /* @__PURE__ */ React.createElement("div", {
    className: classNames([
      "Task",
      status === "completed" && "Task--completed",
      selected && "Task--selected"
    ]),
    id
  }, name);
};
export default Task;
