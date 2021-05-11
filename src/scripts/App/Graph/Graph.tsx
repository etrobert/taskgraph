import React, { useEffect, useState } from "react";
import { initGraph, updateZoom } from "@/graph";

import "./Graph.css";

const Graph = (): JSX.Element => {
  useEffect(initGraph, []);

  const [zoom, setZoom] = useState(1);

  const onWheel: React.WheelEventHandler = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const newZoom = updateZoom(factor);
    setZoom(newZoom);
  };

  return (
    <div onWheel={onWheel} id="graph">
      <p className="Graph__zoom-indicator">
        {zoom !== 1 && Math.floor(zoom * 100) + "% zoom"}
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
