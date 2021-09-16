import React, { useEffect, useRef } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { DraggableCore } from "react-draggable";

import { addPoints } from "@/geometry";
import useBoxSizeObserver from "@/useBoxSizeObserver";
import { taskBoxSizeStateFamily, TaskId, taskStateFamily } from "@/atoms";

import "./Task.css";

type Props = {
  id: TaskId;
  onDragStart: () => void;
  onDragStop: () => void;
  zoom: number;
};

const Task = ({ id, onDragStart, onDragStop, zoom }: Props): JSX.Element => {
  const [
    {
      position: { x, y },
      name,
      status,
    },
    setTask,
  ] = useRecoilState(taskStateFamily(id));

  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));

  const ref = useRef<HTMLDivElement>(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => {
    if (boxSize !== undefined) setBoxSize(boxSize), [boxSize, setBoxSize];
  });

  return (
    <DraggableCore
      onDrag={(e, data) =>
        setTask((task) => ({
          ...task,
          position: addPoints(task.position, {
            x: data.deltaX,
            y: data.deltaY,
          }),
        }))
      }
      onStart={onDragStart}
      onStop={onDragStop}
      scale={zoom}
    >
      <div
        ref={ref}
        className={`Task ${status === "completed" ? "Task--completed" : ""}`}
        style={{ left: x, top: y }}
        id={id}
      >
        {name}
      </div>
    </DraggableCore>
  );
};

export default Task;
