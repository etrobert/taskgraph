import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { DraggableCore } from "react-draggable";

import { addPoints, Point, squaredDistance } from "@/geometry";
import useBoxSizeObserver from "@/useBoxSizeObserver";
import {
  selectedTasksState,
  taskBoxSizeStateFamily,
  TaskId,
  taskSelectedSelectorFamily,
  taskStateFamily,
} from "@/atoms";

import "./Task.css";
import classNames from "@/classNames";

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

  const selected = useRecoilValue(taskSelectedSelectorFamily(id));

  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));

  const ref = useRef<HTMLDivElement>(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => {
    if (boxSize !== undefined) setBoxSize(boxSize), [boxSize, setBoxSize];
  });

  const setSelectedTasks = useSetRecoilState(selectedTasksState);

  const [dragOrigin, setDragOrigin] = useState<Point>({ x: 0, y: 0 });

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
      onStart={(_, data) => {
        setDragOrigin(data);
        onDragStart();
      }}
      onStop={(event, data) => {
        // If it has not moved a lot since the beginning of the drag
        // We consider it as a click
        const movedThreshold = 5;
        if (squaredDistance(dragOrigin, data) < movedThreshold * movedThreshold)
          // If shift is pressed we add the task to the selected tasks
          // Else we set the task becomes the only selected task
          setSelectedTasks(event.shiftKey ? (tasks) => [...tasks, id] : [id]);
        onDragStop();
      }}
      scale={zoom}
    >
      <div
        ref={ref}
        className={classNames([
          "Task",
          status === "completed" && "Task--completed",
          selected && "Task--selected",
        ])}
        style={{ left: x, top: y }}
        id={id}
      >
        {name}
      </div>
    </DraggableCore>
  );
};

export default Task;
