import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useRecoilValue } from "recoil";

import type Cy from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";

import {
  drawModeState,
  workspaceDependenciesState,
  workspaceTasksState,
} from "@/atoms";
import useSetTaskSelected from "@/hooks/useSetTaskSelected";
import useSetDependencySelected from "@/hooks/useSetDependencySelected";
import useFirestoreState from "@/hooks/useFirestoreState";
import useInitCytoscapeExtensions from "@/hooks/useInitCytoscapeExtensions";

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
  const tasks = useRecoilValue(workspaceTasksState);
  const dependencies = useRecoilValue(workspaceDependenciesState);

  const setTaskSelected = useSetTaskSelected();
  const setDependencySelected = useSetDependencySelected();

  const [cy, setCy] = useState<Cy.Core>();

  const drawMode = useRecoilValue(drawModeState);

  const { updateTask, addDependency } = useFirestoreState();

  const { edgeHandles } = useInitCytoscapeExtensions(cy);

  useCytoscapeEvent(cy, "select", ({ target }) => {
    target.isNode()
      ? setTaskSelected(target.data().id, true)
      : setDependencySelected(target.data().id, true);
  });

  useCytoscapeEvent(cy, "unselect", ({ target }) => {
    target.isNode()
      ? setTaskSelected(target.data().id, false)
      : setDependencySelected(target.data().id, false);
  });

  useCytoscapeEvent(cy, "dragfree", ({ target }) => {
    if (!target.isNode()) return;
    updateTask(target.data().id, { position: target.position() });
  });

  useCytoscapeEvent(
    cy,
    "ehcomplete",
    // TODO: Extend type of useCytoscapeEvent
    // @ts-expect-error edgehandles do not type events
    (
      event: Cy.EventObject,
      sourceNode: Cy.NodeSingular,
      targetNode: Cy.NodeSingular,
      addedEdge: Cy.EdgeSingular
    ) => {
      console.log("complete");
      addDependency(sourceNode.data().id, targetNode.data().id);
      cy?.remove(addedEdge);
    }
  );

  useCytoscapeEvent(cy, "ehstop", (event, sourceNode: Cy.NodeSingular) => {
    // Re-allow the node to be grabbed
    sourceNode.grabify();
    // Re-allow the background to be moved
    cy?.userPanningEnabled(true);
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

  const cyDependencyData = dependencies.map(
    ({ id, predecessor, successor }) => ({
      data: {
        id,
        source: predecessor,
        target: successor,
      },
    })
  );

  return (
    <>
      <CytoscapeComponent
        style={{ height: "100%" }}
        elements={[...cyTaskData, ...cyDependencyData]}
        cy={(cy) => setCy(cy)}
        stylesheet={cytoscapeStylesheet}
      />
      {tasks.map(({ id }) =>
        createPortal(
          <Task id={id} cy={cy} edgeHandles={edgeHandles} />,
          memoizedDivs(id)
        )
      )}
    </>
  );
};

export default GraphCanvas;
