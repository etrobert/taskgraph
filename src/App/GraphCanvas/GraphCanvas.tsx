import React, { useEffect, useRef, useState } from "react";
import { initGraph } from "@/graph";

import "./GraphCanvas.css";
import { snap } from "@/misc";
import useKeyboardShortcuts from "@/useKeyboardShortcuts";
import { useRecoilValue } from "recoil";
import { graphState } from "../atoms";
import Task from "../Task/Task";

type Props = {
  updateGraph: () => void;
};

const GraphCanvas = ({ updateGraph }: Props): JSX.Element => {
  useEffect(initGraph, []);

  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onWheel: React.WheelEventHandler = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const target = 1;
    const offset = 0.1;
    setZoom(snap(target)(offset)(zoom * factor));
  };

  const graphRef = useRef<HTMLDivElement>(null);

  useKeyboardShortcuts({
    center: {
      keys: ["0"],
      callback: (event) => {
        if (event.ctrlKey) {
          setPan({ x: 0, y: 0 });
          setZoom(1);
        }
      },
    },
  });

  // Update pan when the graph sends a graphmoved event
  useEffect(() => {
    if (!graphRef.current) return;
    const element = graphRef.current;
    const handler = (event: Event) => {
      const {
        detail: { pan },
      } = event as CustomEvent<{
        pan: { x: number; y: number };
      }>;
      setPan(pan);
    };
    element.addEventListener("graphmoved", handler);
    return () => element.removeEventListener("graphmoved", handler);
  });

  // Update react state when graph is updated
  useEffect(() => {
    if (!graphRef.current) return;
    const graph = graphRef.current;

    graph.addEventListener("taskmoved", updateGraph);
    graph.addEventListener("newdependency", updateGraph);
    return () => {
      graph.removeEventListener("taskmoved", updateGraph);
      graph.removeEventListener("newdependency", updateGraph);
    };
  }, [updateGraph]);

  const itemsContainerTransform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

  const { tasks } = useRecoilValue(graphState);

  return (
    <div
      onWheel={onWheel}
      id="graph"
      ref={graphRef}
      data-pan-x={pan.x}
      data-pan-y={pan.y}
      data-zoom={zoom}
    >
      <p className="Graph__zoom-indicator">
        {zoom !== 1 && Math.floor(zoom * 100) + "% zoom"}
      </p>
      <div id="itemsContainer" style={{ transform: itemsContainerTransform }}>
        <svg id="arrows">
          <defs>
            <marker
              id="Triangle"
              viewBox="0 0 5 5"
              refX="2"
              refY="2.5"
              markerWidth="2"
              markerHeight="2"
              orient="auto"
            >
              <path
                d="M 0 0 L 5 2.5 L 0 5 z"
                className="link-arrow-triangle-path"
              />
            </marker>
          </defs>
        </svg>
        {tasks.map((id) => (
          <Task key={id} id={id} />
        ))}
      </div>
    </div>
  );
};

export default GraphCanvas;
