import React, { useEffect, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { addPoints } from "@/geometry";
import useBoxSizeObserver from "@/useBoxSizeObserver";
import {
  selectedTasksState,
  taskBoxSizeStateFamily,
  TaskId,
  taskSelectedSelectorFamily,
  taskStateFamily,
} from "@/atoms";
import ClickableDraggableCore from "@/ClickableDraggableCore/ClickableDraggableCore";
import classNames from "@/classNames";
import useFirestoreState from "@/useFirestoreState";

import "./Task.css";

type Props = {
  id: TaskId;
  onDragStart: () => void;
  onDragStop: () => void;
  zoom: number;
};

const Task = ({ id, onDragStart, onDragStop, zoom }: Props): JSX.Element => {
  const [{ position, name, status }, setTask] = useRecoilState(
    taskStateFamily(id)
  );
  const { x, y } = position;

  const selected = useRecoilValue(taskSelectedSelectorFamily(id));

  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));

  const { updateTask } = useFirestoreState();

  const ref = useRef<HTMLDivElement>(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => {
    if (boxSize !== undefined) setBoxSize(boxSize), [boxSize, setBoxSize];
  });

  const setSelectedTasks = useSetRecoilState(selectedTasksState);

  return (
    <ClickableDraggableCore
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
      onStop={() => {
        updateTask(id, { position });
        onDragStop();
      }}
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
      >
        {name}
      </div>
    </ClickableDraggableCore>
  );
};

export default Task;
