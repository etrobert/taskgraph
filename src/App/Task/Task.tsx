import React from "react";
import { useRecoilValue } from "recoil";

import { TaskId, taskSelectedSelectorFamily, taskStateFamily } from "@/atoms";
import classNames from "@/classNames";

import "./Task.css";

type Props = {
  id: TaskId;
};

const Task = ({ id }: Props): JSX.Element => {
  const { name, status } = useRecoilValue(taskStateFamily(id));

  const selected = useRecoilValue(taskSelectedSelectorFamily(id));

  return (
    <div
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
