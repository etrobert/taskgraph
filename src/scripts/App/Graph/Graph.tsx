import React, { useEffect } from "react";

import { initGraph, updateZoom } from "@/graph";

import "./Graph.css";

const Graph = (): JSX.Element => {
  useEffect(initGraph, []);

  const onWheel: React.WheelEventHandler = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    updateZoom(factor);
  };

  return (
    <div onWheel={onWheel} id="graph">
      <p id="zoomIndicator"></p>
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
