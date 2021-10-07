import React, { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import useBoxSizeObserver from "@/useBoxSizeObserver";
import {
  taskBoxSizeStateFamily,
  TaskId,
  taskSelectedSelectorFamily,
  taskStateFamily,
} from "@/atoms";
import classNames from "@/classNames";

import "./Task.css";

type Props = {
  id: TaskId;
};

const Task = ({ id }: Props): JSX.Element => {
  const { name, status } = useRecoilValue(taskStateFamily(id));

  const selected = useRecoilValue(taskSelectedSelectorFamily(id));

  const setBoxSize = useSetRecoilState(taskBoxSizeStateFamily(id));

  const ref = useRef<HTMLDivElement>(null);
  const boxSize = useBoxSizeObserver(ref);
  useEffect(() => {
    if (boxSize !== undefined) setBoxSize(boxSize), [boxSize, setBoxSize];
  });

  return (
    <div
      ref={ref}
      className={classNames([
        "Task",
        status === "completed" && "Task--completed",
        selected && "Task--selected",
      ])}
      id={id}
    >
      {name}
    </div>
  );
};

export default Task;
