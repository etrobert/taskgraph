import React, { useState } from "react";

import "./GraphCanvas.css";
import { snap } from "@/misc";
import useKeyboardShortcuts from "@/useKeyboardShortcuts";
import { useRecoilValue } from "recoil";
import { graphState } from "../atoms";
import Task from "../Task/Task";
import Dependency from "../Dependency/Dependency";
import { DraggableCore } from "react-draggable";
import { addPoints } from "@/geometry";

/**
 * Interactive canvas displaying a Task Graph
 *
 * The outer div stays in place, receives the dragging events
 *
 * The inner div contains the tasks and dependencies and gets translated around
 */
const GraphCanvas = (): JSX.Element => {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Used to not drag the background when a task is being dragged
  const [draggedTasksCount, setDraggedTasksCount] = useState(0);

  const onWheel: React.WheelEventHandler = (event) => {
    const factor = event.deltaY < 0 ? 1.1 : 0.9;
    const target = 1;
    const offset = 0.1;
    setZoom(snap(target)(offset)(zoom * factor));
  };

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

  const { tasks, dependencies } = useRecoilValue(graphState);

  return (
    <DraggableCore
      onDrag={(e, data) => {
        if (draggedTasksCount === 0)
          setPan((pan) => addPoints(pan, { x: data.deltaX, y: data.deltaY }));
      }}
    >
      <div onWheel={onWheel} id="graph">
        <p className="Graph__zoom-indicator">
          {zoom !== 1 && Math.floor(zoom * 100) + "% zoom"}
        </p>
        <div style={{ transform: itemsContainerTransform }}>
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
            {dependencies.map((id) => (
              <Dependency key={id} id={id} />
            ))}
          </svg>
          {tasks.map((id) => (
            <Task
              key={id}
              id={id}
              onDragStart={() => setDraggedTasksCount((count) => count + 1)}
              onDragStop={() => setDraggedTasksCount((count) => count - 1)}
              zoom={zoom}
            />
          ))}
        </div>
      </div>
    </DraggableCore>
  );
};

export default GraphCanvas;
