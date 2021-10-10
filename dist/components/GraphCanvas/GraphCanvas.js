import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {createPortal} from "../../../_snowpack/pkg/react-dom.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import CytoscapeComponent from "../../../_snowpack/pkg/react-cytoscapejs.js";
import {
  drawModeState,
  projectDependenciesState,
  projectTasksState
} from "../../atoms.js";
import useSetTaskSelected from "../../hooks/useSetTaskSelected.js";
import useSetDependencySelected from "../../hooks/useSetDependencySelected.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import useInitCytoscapeExtensions from "../../hooks/useInitCytoscapeExtensions.js";
import Task from "../Task/Task.js";
import useMemoizedDivs from "./useMemoizedDivs.js";
import useCytoscapeEvent from "./useCytoscapeEvent.js";
import "./GraphCanvas.css.proxy.js";
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
  const tasks = useRecoilValue(projectTasksState);
  const dependencies = useRecoilValue(projectDependenciesState);
  const setTaskSelected = useSetTaskSelected();
  const setDependencySelected = useSetDependencySelected();
  const [cy, setCy] = useState();
  const drawMode = useRecoilValue(drawModeState);
  const {updateTask, addDependency} = useFirestoreState();
  const {edgeHandles} = useInitCytoscapeExtensions(cy);
  useCytoscapeEvent(cy, "select", ({target}) => {
    target.isNode() ? setTaskSelected(target.data().id, true) : setDependencySelected(target.data().id, true);
  });
  useCytoscapeEvent(cy, "unselect", ({target}) => {
    target.isNode() ? setTaskSelected(target.data().id, false) : setDependencySelected(target.data().id, false);
  });
  useCytoscapeEvent(cy, "dragfree", ({target}) => {
    if (!target.isNode())
      return;
    updateTask(target.data().id, {position: target.position()});
  });
  useCytoscapeEvent(cy, "ehcomplete", (event, sourceNode, targetNode, addedEdge) => {
    console.log("complete");
    addDependency(sourceNode.data().id, targetNode.data().id);
    cy?.remove(addedEdge);
  });
  useEffect(() => {
    if (edgeHandles === void 0)
      return;
    drawMode ? edgeHandles.enableDrawMode() : edgeHandles.disableDrawMode();
  }, [drawMode, edgeHandles]);
  const memoizedDivs = useMemoizedDivs();
  const cyTaskData = tasks.map(({id, position}) => ({
    data: {id, dom: memoizedDivs(id)},
    position: {...position}
  }));
  const cyDependencyData = dependencies.map(({id, predecessor, successor}) => ({
    data: {
      id,
      source: predecessor,
      target: successor
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
