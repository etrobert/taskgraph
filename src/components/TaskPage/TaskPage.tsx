import React from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";
import { deleteField } from "@firebase/firestore";

import { taskStateFamily } from "@/atoms";
import useFirestoreState from "@/hooks/useFirestoreState";

import type { RouteComponentProps } from "react-router";
import type { Priority, TaskId } from "@/types";

import "./TaskPage.css";

type Props = RouteComponentProps<{ id: TaskId }>;

const TaskPage = ({ match }: Props): JSX.Element => {
  const { id } = match.params;
  const { name, priority } = useRecoilValue(taskStateFamily(id));
  const { updateTask } = useFirestoreState();

  return (
    <div className="TaskPage">
      {name}
      <label>
        Priority:{" "}
        <select
          value={priority ?? ""}
          onChange={(event) => {
            const value = event.target.value as Priority | "";
            const newPriority = value === "" ? deleteField() : value;
            updateTask(id, { priority: newPriority });
          }}
        >
          <option value=""></option>
          <option value="veryLow">Very Low</option>
          <option value="low">Low</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="veryHigh">Very High</option>
        </select>
      </label>
      <Link to="/">Close</Link>
    </div>
  );
};

export default TaskPage;
