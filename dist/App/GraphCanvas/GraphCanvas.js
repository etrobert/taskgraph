import React, {useRef, useState} from "../../../snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../../snowpack/pkg/recoil.js";
import {snap} from "../../misc.js";
import {addPoints} from "../../geometry.js";
import useKeyboardShortcuts from "../../useKeyboardShortcuts.js";
import {projectState, selectedTasksState} from "../../atoms.js";
import ClickableDraggableCore from "../../ClickableDraggableCore/ClickableDraggableCore.js";
import Task from "../Task/Task.js";
import Dependency from "../Dependency/Dependency.js";
import "./GraphCanvas.css.proxy.js";
const GraphCanvas = () => {
  const [pan, setPan] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const [draggedTasksCount, setDraggedTasksCount] = useState(0);
  const onWheel = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const target = 1;
    const offset = 0.1;
    setZoom(snap(target)(offset)(zoom * factor));
  };
  useKeyboardShortcuts({
    center: {
      keys: ["0"],
      callback: (event) => {
        if (event.ctrlKey) {
          setPan({x: 0, y: 0});
          setZoom(1);
        }
      }
    }
  });
  const itemsContainerTransform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
  const {tasks, dependencies} = useRecoilValue(projectState);
  const setSelectedTasks = useSetRecoilState(selectedTasksState);
  const ref = useRef(null);
  return /* @__PURE__ */ React.createElement(ClickableDraggableCore, {
    onDrag: (e, data) => {
      if (draggedTasksCount === 0)
        setPan((pan2) => addPoints(pan2, {x: data.deltaX, y: data.deltaY}));
    },
    onClick: (event) => {
      if (ref.current === null)
        return;
      if (event.target === ref.current)
        setSelectedTasks([]);
    }
  }, /* @__PURE__ */ React.createElement("div", {
    onWheel,
    id: "graph",
    ref
  }, /* @__PURE__ */ React.createElement("p", {
    className: "Graph__zoom-indicator"
  }, zoom !== 1 && Math.floor(zoom * 100) + "% zoom"), /* @__PURE__ */ React.createElement("div", {
    style: {transform: itemsContainerTransform}
  }, /* @__PURE__ */ React.createElement("svg", {
    id: "arrows"
  }, /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("marker", {
    id: "Triangle",
    viewBox: "0 0 5 5",
    refX: "2",
    refY: "2.5",
    markerWidth: "2",
    markerHeight: "2",
    orient: "auto"
  }, /* @__PURE__ */ React.createElement("path", {
    d: "M 0 0 L 5 2.5 L 0 5 z",
    className: "link-arrow-triangle-path"
  }))), dependencies.map((id) => /* @__PURE__ */ React.createElement(Dependency, {
    key: id,
    id
  }))), tasks.map((id) => /* @__PURE__ */ React.createElement(Task, {
    key: id,
    id,
    onDragStart: () => setDraggedTasksCount((count) => count + 1),
    onDragStop: () => setDraggedTasksCount((count) => count - 1),
    zoom
  })))));
};
export default GraphCanvas;
