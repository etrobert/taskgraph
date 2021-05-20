import React, { useEffect, useRef, useState } from "react";
import { Graph as GraphData } from "@/graph";

import "./Graph.css";
import { snap } from "@/misc";
import useKeyboardShortcuts from "@/useKeyboardShortcuts";
import Task from "./Task/Task";
import { addPoints, subPoints } from "@/geometry";
import Dependencies from "./Dependencies/Dependencies";

const Graph = (): JSX.Element => {
  const [graph, setGraph] = useState<GraphData>({
    tasks: [],
    dependencies: [],
  });

  useEffect(() => {
    const graphItem = window.localStorage.getItem("graph");
    if (!graphItem) return;
    setGraph(JSON.parse(graphItem));
  }, []);

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

  const itemsContainerTransform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;

  const [grabbing, setGrabbing] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  return (
    <div
      onPointerDown={(event) => {
        if (event.defaultPrevented) return;
        setGrabbing(true);
        setLastPos({ x: event.clientX, y: event.clientY });
      }}
      onPointerUp={() => setGrabbing(false)}
      onPointerMove={(event) => {
        // TODO Remove code duplication
        if (!grabbing) return;

        const currentPos = {
          x: event.clientX,
          y: event.clientY,
        };

        const offset = subPoints(currentPos, lastPos);

        setPan((pan) => addPoints(pan, offset));
        setLastPos(currentPos);
      }}
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
        {graph.tasks.map((task, index) => (
          <Task
            key={task.name}
            task={task}
            onMove={(pos) =>
              setGraph((graph) => {
                const { tasks, ...rest } = graph;
                tasks[index] = { ...tasks[index], pos };
                return { tasks, ...rest };
              })
            }
            zoom={zoom}
          />
        ))}
        <Dependencies graph={graph} />
      </div>
    </div>
  );
};

export default Graph;
