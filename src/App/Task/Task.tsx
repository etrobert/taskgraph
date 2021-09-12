import React from "react";
import "./Task.css";

type Props = {
  x: number;
  y: number;
  completed?: boolean;
  name: string;
  id: string;
};

const Task = ({ x, y, completed, name, id }: Props): JSX.Element => (
  <div
    className={`task ${completed ? "completed" : ""}`}
    style={{ left: x, top: y }}
    id={id}
  >
    {name}
  </div>
);

export default Task;
