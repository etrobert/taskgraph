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
    status,
  } = useRecoilValue(taskStateFamily(id));
  return (
    <div
      className={`Task ${status === "completed" ? "Task--completed" : ""}`}
      style={{ left: x, top: y }}
      id={id}
    >
      {name}
    </div>
  );
};

export default Task;
