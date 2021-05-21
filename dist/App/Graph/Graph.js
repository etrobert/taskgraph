import React, {useEffect, useRef, useState} from "../../../snowpack/pkg/react.js";
import {initGraph} from "../../graph.js";
import "./Graph.css.proxy.js";
import {snap} from "../../misc.js";
import useKeyboardShortcuts from "../../useKeyboardShortcuts.js";
import {loadFromLocalStorage, saveToLocalStorage} from "../../storage.js";
const Graph = () => {
  useEffect(initGraph, []);
  const [pan, setPan] = useState({x: 0, y: 0});
  const [zoom, setZoom] = useState(1);
  const onWheel = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const target = 1;
    const offset = 0.1;
    setZoom(snap(target)(offset)(zoom * factor));
  };
  const graphRef = useRef(null);
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
  useEffect(() => {
    if (!graphRef.current)
      return;
    const element = graphRef.current;
    const handler = (event) => {
      const {
        detail: {pan: pan2}
      } = event;
      setPan(pan2);
    };
    element.addEventListener("graphmoved", handler);
    return () => element.removeEventListener("graphmoved", handler);
  });
  useEffect(() => {
    if (!graphRef.current)
      return;
    const graph = graphRef.current;
    graph.addEventListener("taskmoved", saveToLocalStorage);
    graph.addEventListener("newdependency", saveToLocalStorage);
    return () => {
      graph.removeEventListener("taskmoved", saveToLocalStorage);
      graph.removeEventListener("newdependency", saveToLocalStorage);
    };
  }, []);
  useEffect(loadFromLocalStorage, []);
  const itemsContainerTransform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
  return /* @__PURE__ */ React.createElement("div", {
    onWheel,
    id: "graph",
    ref: graphRef,
    "data-pan-x": pan.x,
    "data-pan-y": pan.y,
    "data-zoom": zoom
  }, /* @__PURE__ */ React.createElement("p", {
    className: "Graph__zoom-indicator"
  }, zoom !== 1 && Math.floor(zoom * 100) + "% zoom"), /* @__PURE__ */ React.createElement("div", {
    id: "itemsContainer",
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
  }))))));
};
export default Graph;
