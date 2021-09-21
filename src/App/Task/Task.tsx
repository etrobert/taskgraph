import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { addPoints } from "@/geometry";
import useBoxSizeObserver from "@/useBoxSizeObserver";
import {
  hoveredTaskState,
  selectedTasksState,
  taskBoxSizeStateFamily,
  TaskId,
  taskSelectedSelectorFamily,
  taskStateFamily,
} from "@/atoms";
import ClickableDraggableCore from "@/ClickableDraggableCore/ClickableDraggableCore";
import classNames from "@/classNames";

import "./Task.css";
import NewDependencyHandle from "./NewDependencyHandle/NewDependencyHandle";

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

  const setHoveredTask = useSetRecoilState(hoveredTaskState);

  return (
    <ClickableDraggableCore
      onDrag={(e, data) => {
        if (e.defaultPrevented) return;
        setTask((task) => ({
          ...task,
          position: addPoints(task.position, {
            x: data.deltaX,
            y: data.deltaY,
          }),
        }));
      }}
      onStart={onDragStart}
      onStop={onDragStop}
      onClick={(event) =>
        // If shift is pressed we add the task to the selected tasks
        // Else the task becomes the only selected task
        setSelectedTasks(event.shiftKey ? (tasks) => [...tasks, id] : [id])
      }
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
        onMouseEnter={() => setHoveredTask(id)}
        onMouseLeave={() => setHoveredTask(null)}
      >
        {name}
        <NewDependencyHandle
          taskId={id}
          dragOffsetParent={ref.current?.parentElement ?? undefined}
          zoom={zoom}
        />
      </div>
    </ClickableDraggableCore>
  );
};

export default Task;
