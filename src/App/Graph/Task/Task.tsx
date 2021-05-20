import React, { useRef, useState } from "react";

import "./Task.css";

import { Task as TaskData } from "@/graph";
import { addPoints, Point, subPoints } from "@/geometry";

type Props = {
  task: TaskData;
  onMove: (pos: Point) => void;
};

const Task = ({ task: { pos, name }, onMove }: Props): JSX.Element => {
  const [dragging, setDragging] = useState(false);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="Task"
      onPointerDown={(event) => {
        event.preventDefault();
        setDragging(true);
        setLastPos({ x: event.clientX, y: event.clientY });
        ref.current?.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        if (!dragging) return;

        const currentPos = {
          x: event.clientX,
          y: event.clientY,
        };

        const offset = subPoints(currentPos, lastPos);

        onMove(addPoints(pos, offset));

        setLastPos(currentPos);
      }}
      onPointerUp={() => setDragging(false)}
      style={{ left: pos.x, top: pos.y }}
    >
      {name}
    </div>
  );
};

export default Task;
