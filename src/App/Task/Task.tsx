import React from "react";
import { useRecoilValue } from "recoil";
import { TaskId, taskStateFamily } from "../atoms";
import "./Task.css";

type Props = {
  id: TaskId;
};

const Task = ({ id }: Props): JSX.Element => {
  const {
    position: { x, y },
    name,
  } = useRecoilValue(taskStateFamily(id));
  const completed = "completed"; // TODO Add completion state to Task
  return (
    <div
      className={`Task ${completed ? "Task--completed" : ""}`}
      style={{ left: x, top: y }}
      id={id}
    >
      {name}
    </div>
  );
};

export default Task;
