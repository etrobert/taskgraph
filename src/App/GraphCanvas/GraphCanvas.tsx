import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useRecoilValue } from "recoil";

import cytoscape from "cytoscape";
import type Cy from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
// @ts-expect-error Module is not typed
import cytoscapeDomNode from "cytoscape-dom-node";
import edgehandles from "cytoscape-edgehandles";
import type { EdgeHandlesInstance } from "cytoscape-edgehandles";

import {
  drawModeState,
  projectDependenciesSelector,
  projectTasksSelector,
} from "@/atoms";
import useSetTaskSelected from "@/useSetTaskSelected";

import Task from "../Task/Task";

import useMemoizedDivs from "./useMemoizedDivs";
import useCytoscapeEvent from "./useCytoscapeEvent";

import "./GraphCanvas.css";

cytoscape.use(cytoscapeDomNode);
cytoscape.use(edgehandles);

const cytoscapeStylesheet = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
      "background-opacity": 0,
    },
  },
  {
    selector: "edge",
    style: {
      "target-arrow-shape": "triangle",
      "curve-style": "bezier",
      width: "5",
      "target-distance-from-node": 5,
      "source-distance-from-node": 5,
    },
  },
];

/**
 * Interactive canvas displaying a Task Graph
 */
const GraphCanvas = (): JSX.Element => {
  const tasks = useRecoilValue(projectTasksSelector);
  const dependencies = useRecoilValue(projectDependenciesSelector);

  const setTaskSelected = useSetTaskSelected();

  const [cy, setCy] = useState<Cy.Core>();
  const [eh, setEh] = useState<EdgeHandlesInstance>();

  const drawMode = useRecoilValue(drawModeState);

  // @ts-expect-error Module is not typed
  useEffect(() => cy?.domNode(), [cy]);

  useCytoscapeEvent(cy, "select", (event) =>
    setTaskSelected(event.target.data().id, true)
  );

  useCytoscapeEvent(cy, "unselect", (event) =>
    setTaskSelected(event.target.data().id, false)
  );

  // Initialise edgehandles instance
  useEffect(() => {
    if (cy === undefined) return;
    setEh(cy.edgehandles());
  }, [cy]);

  // Update edgehandles draw mode
  useEffect(() => {
    if (eh === undefined) return;
    drawMode ? eh.enableDrawMode() : eh.disableDrawMode();
  }, [drawMode, eh]);

  const memoizedDivs = useMemoizedDivs();

  const cyTaskData = tasks.map(({ id, position }) => ({
    data: { id, dom: memoizedDivs(id) },
    position: { ...position }, // We copy position because recoil position is read only
  }));

  const cyDependencyData = dependencies.map((dependency) => ({
    data: {
      source: dependency.predecessor,
      target: dependency.successor,
    },
  }));

  return (
    <>
      <CytoscapeComponent
        style={{ height: "100%" }}
        elements={[...cyTaskData, ...cyDependencyData]}
        cy={(cy) => setCy(cy)}
        stylesheet={cytoscapeStylesheet}
      />
      {tasks.map(({ id }) => createPortal(<Task id={id} />, memoizedDivs(id)))}
    </>
  );
};

export default GraphCanvas;
