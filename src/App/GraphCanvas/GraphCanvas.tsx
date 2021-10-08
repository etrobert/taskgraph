import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useRecoilValue } from "recoil";

import type Cy from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";

import {
  drawModeState,
  projectDependenciesSelector,
  projectTasksSelector,
} from "@/atoms";
import useSetTaskSelected from "@/useSetTaskSelected";
import useFirestoreState from "@/useFirestoreState";
import useInitCytoscapeExtensions from "@/useInitCytoscapeExtensions";

import Task from "../Task/Task";

import useMemoizedDivs from "./useMemoizedDivs";
import useCytoscapeEvent from "./useCytoscapeEvent";

import "./GraphCanvas.css";

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

  const drawMode = useRecoilValue(drawModeState);

  const { updateTask } = useFirestoreState();

  const { edgeHandles } = useInitCytoscapeExtensions(cy);

  useCytoscapeEvent(cy, "select", ({ target }) => {
    if (!target.isNode()) return;
    setTaskSelected(target.data().id, true);
  });

  useCytoscapeEvent(cy, "unselect", ({ target }) => {
    if (!target.isNode()) return;
    setTaskSelected(target.data().id, false);
  });

  useCytoscapeEvent(cy, "dragfree", ({ target }) => {
    if (!target.isNode()) return;
    updateTask(target.data().id, { position: target.position() });
  });

  // Update edgehandles draw mode
  useEffect(() => {
    if (edgeHandles === undefined) return;
    drawMode ? edgeHandles.enableDrawMode() : edgeHandles.disableDrawMode();
  }, [drawMode, edgeHandles]);

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
