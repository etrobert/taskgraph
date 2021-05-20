import React, { useEffect, useRef, useState } from "react";

import "./Task.css";

import { Task as TaskData } from "@/graph";
import { addPoints, Point, Size, subPoints } from "@/geometry";
import useResizeObserver from "@/useResizeObserver";

type Props = {
  task: TaskData;
  onMove: (pos: Point) => void;
  zoom: number;
  onResize: (size: Size) => void;
};

const Task = ({
  task: { pos, name },
  onMove,
  onResize,
  zoom,
}: Props): JSX.Element => {
  const [dragging, setDragging] = useState(false);
  // TODO Transform into discriminated union
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const ref = useRef<HTMLDivElement>(null);

  const size = useResizeObserver(ref);

  // We don't do anything at first when size is undefined
  useEffect(() => size && onResize(size), [onResize, size]);

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

        const baseOffset = subPoints(currentPos, lastPos);

        const offset = { x: baseOffset.x / zoom, y: baseOffset.y / zoom };

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
