import React from "react";
import { useRecoilValue } from "recoil";
import { TaskId, taskStateFamily } from "../atoms";
import "./Task.css";

type Props = {
  id: TaskId;
};

// TODO Use BEM notation for completed
// TODO Use Task instead of task for class name
const Task = ({ id }: Props): JSX.Element => {
  const {
    position: { x, y },
    name,
  } = useRecoilValue(taskStateFamily(id));
  const completed = "completed"; // TODO Add completion state to Task
  return (
    <div
      className={`task ${completed ? "completed" : ""}`}
      style={{ left: x, top: y }}
      id={id}
    >
      {name}
    </div>
  );
};

export default Task;
