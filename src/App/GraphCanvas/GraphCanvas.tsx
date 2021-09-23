import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useRecoilValue } from "recoil";

import cytoscape from "cytoscape";
import type Cy from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";
// @ts-expect-error Module is not typed
import cytoscapeDomNode from "cytoscape-dom-node";

import { projectDependenciesSelector, projectState } from "@/atoms";

import Task from "../Task/Task";

import useMemoizedDivs from "./useMemoizedDivs";
import useCytoscapeEvent from "./useCytoscapeEvent";

import "./GraphCanvas.css";

cytoscape.use(cytoscapeDomNode);

const cytoscapeStylesheet = [
  {
    selector: "node",
    style: {
      shape: "rectangle",
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
  const { tasks } = useRecoilValue(projectState);
  const dependencies = useRecoilValue(projectDependenciesSelector);

  const [cy, setCy] = useState<Cy.Core>();

  // @ts-expect-error Module is not typed
  useEffect(() => cy?.domNode(), [cy]);

  useCytoscapeEvent(cy, "select", (event) =>
    console.log("Selected " + event.target.data().id)
  );

  const memoizedDivs = useMemoizedDivs();

  const cyTaskData = tasks.map((task) => ({
    data: { id: task, label: task, dom: memoizedDivs(task) },
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
      {tasks.map((task) =>
        createPortal(<Task zoom={1} id={task} />, memoizedDivs(task))
      )}
    </>
  );
};

export default GraphCanvas;
