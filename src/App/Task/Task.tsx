import React, { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useBoxSizeObserver from "@/useBoxSizeObserver";

import { taskBoxSizeStateFamily, TaskId, taskStateFamily } from "../atoms";

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

  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));

  const ref = useRef<HTMLDivElement>(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => boxSize && setBoxSize(boxSize), [boxSize, setBoxSize]);

  return (
    <div
      ref={ref}
      className={`Task ${status === "completed" ? "Task--completed" : ""}`}
      style={{ left: x, top: y }}
      id={id}
    >
      {name}
    </div>
  );
};

export default Task;
