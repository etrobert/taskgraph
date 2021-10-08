import React, {useEffect, useState} from "../../../snowpack/pkg/react.js";
import {createPortal} from "../../../snowpack/pkg/react-dom.js";
import {useRecoilValue} from "../../../snowpack/pkg/recoil.js";
import cytoscape from "../../../snowpack/pkg/cytoscape.js";
import CytoscapeComponent from "../../../snowpack/pkg/react-cytoscapejs.js";
import cytoscapeDomNode from "../../../snowpack/pkg/cytoscape-dom-node.js";
import edgehandles from "../../../snowpack/pkg/cytoscape-edgehandles.js";
import {
  drawModeState,
  projectDependenciesSelector,
  projectTasksSelector
} from "../../atoms.js";
import useSetTaskSelected from "../../useSetTaskSelected.js";
import Task from "../Task/Task.js";
import useMemoizedDivs from "./useMemoizedDivs.js";
import useCytoscapeEvent from "./useCytoscapeEvent.js";
import "./GraphCanvas.css.proxy.js";
cytoscape.use(cytoscapeDomNode);
cytoscape.use(edgehandles);
const cytoscapeStylesheet = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      "background-opacity": 0
    }
  },
  {
    selector: "edge",
    style: {
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      width: "5",
      "target-distance-from-node": 5,
      "source-distance-from-node": 5
    }
  }
];
const GraphCanvas = () => {
  const tasks = useRecoilValue(projectTasksSelector);
  const dependencies = useRecoilValue(projectDependenciesSelector);
  const setTaskSelected = useSetTaskSelected();
  const [cy, setCy] = useState();
  const [eh, setEh] = useState();
  const drawMode = useRecoilValue(drawModeState);
  useEffect(() => cy?.domNode(), [cy]);
  useCytoscapeEvent(cy, "select", (event) => setTaskSelected(event.target.data().id, true));
  useCytoscapeEvent(cy, "unselect", (event) => setTaskSelected(event.target.data().id, false));
  useEffect(() => {
    if (cy === void 0)
      return;
    setEh(cy.edgehandles());
  }, [cy]);
  useEffect(() => {
    if (eh === void 0)
      return;
    drawMode ? eh.enableDrawMode() : eh.disableDrawMode();
  }, [drawMode, eh]);
  const memoizedDivs = useMemoizedDivs();
  const cyTaskData = tasks.map(({id, position}) => ({
    data: {id, dom: memoizedDivs(id)},
    position: {...position}
  }));
  const cyDependencyData = dependencies.map((dependency) => ({
    data: {
      source: dependency.predecessor,
      target: dependency.successor
    }
  }));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(CytoscapeComponent, {
    style: {height: "100%"},
    elements: [...cyTaskData, ...cyDependencyData],
    cy: (cy2) => setCy(cy2),
    stylesheet: cytoscapeStylesheet
  }), tasks.map(({id}) => createPortal(/* @__PURE__ */ React.createElement(Task, {
    id
  }), memoizedDivs(id))));
};
export default GraphCanvas;
