import React, {useEffect, useRef} from "../../../snowpack/pkg/react.js";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "../../../snowpack/pkg/recoil.js";
import {addPoints} from "../../geometry.js";
import useBoxSizeObserver from "../../useBoxSizeObserver.js";
import {
  selectedTasksState,
  taskBoxSizeStateFamily,
  taskSelectedSelectorFamily,
  taskStateFamily
} from "../../atoms.js";
import ClickableDraggableCore from "../../ClickableDraggableCore/ClickableDraggableCore.js";
import classNames from "../../classNames.js";
import useFirestoreState from "../../useFirestoreState.js";
import "./Task.css.proxy.js";
const Task = ({id, onDragStart, onDragStop, zoom}) => {
  const [{position, name, status}, setTask] = useRecoilState(taskStateFamily(id));
  const {x, y} = position;
  const selected = useRecoilValue(taskSelectedSelectorFamily(id));
  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));
  const {updateTask} = useFirestoreState();
  const ref = useRef(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => {
    if (boxSize !== void 0)
      setBoxSize(boxSize), [boxSize, setBoxSize];
  });
  const setSelectedTasks = useSetRecoilState(selectedTasksState);
  return /* @__PURE__ */ React.createElement(ClickableDraggableCore, {
    onDrag: (e, data) => setTask((task) => ({
      ...task,
      position: addPoints(task.position, {
        x: data.deltaX,
        y: data.deltaY
      })
    })),
    onStart: onDragStart,
    onStop: () => {
      updateTask(id, {position});
      onDragStop();
    },
    onClick: (event) => setSelectedTasks(event.shiftKey ? (tasks) => [...tasks, id] : [id]),
    scale: zoom
  }, /* @__PURE__ */ React.createElement("div", {
    ref,
    className: classNames([
      "Task",
      status === "completed" && "Task--completed",
      selected && "Task--selected"
    ]),
    style: {left: x, top: y},
    id
  }, name));
};
export default Task;
