import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {createPortal} from "../../../_snowpack/pkg/react-dom.js";
import {useRecoilValue} from "../../../_snowpack/pkg/recoil.js";
import CytoscapeComponent from "../../../_snowpack/pkg/react-cytoscapejs.js";
import {
  drawModeState,
  projectDependenciesSelector,
  projectTasksSelector
} from "../../atoms.js";
import useSetTaskSelected from "../../useSetTaskSelected.js";
import useFirestoreState from "../../useFirestoreState.js";
import useInitCytoscapeExtensions from "../../useInitCytoscapeExtensions.js";
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
  const tasks = useRecoilValue(projectTasksSelector);
  const dependencies = useRecoilValue(projectDependenciesSelector);
  const setTaskSelected = useSetTaskSelected();
  const [cy, setCy] = useState();
  const drawMode = useRecoilValue(drawModeState);
  const {updateTask} = useFirestoreState();
  const {edgeHandles} = useInitCytoscapeExtensions(cy);
  useCytoscapeEvent(cy, "select", ({target}) => {
    if (!target.isNode())
      return;
    setTaskSelected(target.data().id, true);
  });
  useCytoscapeEvent(cy, "unselect", ({target}) => {
    if (!target.isNode())
      return;
    setTaskSelected(target.data().id, false);
  });
  useCytoscapeEvent(cy, "dragfree", ({target}) => {
    if (!target.isNode())
      return;
    updateTask(target.data().id, {position: target.position()});
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
