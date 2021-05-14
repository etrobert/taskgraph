import React, {useEffect} from "../../../snowpack/pkg/react.js";
import {initGraph} from "../../graph.js";
import "./Graph.css.proxy.js";
const Graph = () => {
  useEffect(initGraph, []);
  return /* @__PURE__ */ React.createElement("div", {
    id: "graph"
  }, /* @__PURE__ */ React.createElement("p", {
    id: "zoomIndicator"
  }), /* @__PURE__ */ React.createElement("div", {
    id: "itemsContainer"
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
