import React, { useEffect, useRef, useState } from "react";
import { initGraph, updatePanzoom } from "@/graph";

import "./Graph.css";
import { snap } from "@/misc";

const Graph = (): JSX.Element => {
  useEffect(initGraph, []);

  const [panzoom, setPanzoom] = useState({ pan: { x: 0, y: 0 }, zoom: 1 });

  const onWheel: React.WheelEventHandler = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = snap(1)(0.1)(panzoom.zoom * factor);
    setPanzoom((state) => ({ ...state, zoom: newZoom }));
  };

  useEffect(updatePanzoom, [panzoom]);

  const graphRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!graphRef.current) return;
    const element = graphRef.current;
    const handler = (event: Event) => {
      const {
        detail: { pan },
      } = event as CustomEvent<{
        pan: { x: number; y: number };
      }>;
      setPanzoom((state) => ({ ...state, pan }));

      updatePanzoom();
    };
    element.addEventListener("graphmoved", handler);
    return () => element.removeEventListener("graphmoved", handler);
  });

  return (
    <div
      onWheel={onWheel}
      id="graph"
      ref={graphRef}
      data-panzoom-x={panzoom.pan.x}
      data-panzoom-y={panzoom.pan.y}
      data-panzoom-zoom={panzoom.zoom}
    >
      <p className="Graph__zoom-indicator">
        {panzoom.zoom !== 1 && Math.floor(panzoom.zoom * 100) + "% zoom"}
      </p>
      <div id="itemsContainer">
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
      </div>
    </div>
  );
};

export default Graph;
