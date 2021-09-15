import React, { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useBoxSizeObserver from "@/useBoxSizeObserver";

import { taskBoxSizeStateFamily, TaskId, taskStateFamily } from "../atoms";

import "./Task.css";
import Draggable from "react-draggable";

type Props = {
  id: TaskId;
  onDragStart: () => void;
  onDragStop: () => void;
  zoom: number;
};

const Task = ({ id, onDragStart, onDragStop, zoom }: Props): JSX.Element => {
  const {
    position: { x, y },
    name,
    status,
  } = useRecoilValue(taskStateFamily(id));

  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));

  const ref = useRef<HTMLDivElement>(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => {
    if (boxSize !== undefined) setBoxSize(boxSize), [boxSize, setBoxSize];
  });

  return (
    <Draggable onStart={onDragStart} onStop={onDragStop} scale={zoom}>
      <div
        ref={ref}
        className={`Task ${status === "completed" ? "Task--completed" : ""}`}
        style={{ left: x, top: y }}
        id={id}
      >
        {name}
      </div>
    </Draggable>
  );
};

export default Task;
