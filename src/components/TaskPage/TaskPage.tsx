import React from "react";
import { useRecoilValue } from "recoil";
import { Link } from "react-router-dom";

import { taskStateFamily } from "@/atoms";

import type { RouteComponentProps } from "react-router";
import type { TaskId } from "@/types";

import "./TaskPage.css";

type Props = RouteComponentProps<{ id: TaskId }>;

const TaskPage = ({ match }: Props): JSX.Element => {
  const { id } = match.params;
  const { name } = useRecoilValue(taskStateFamily(id));

  return (
    <div className="TaskPage">
      {name}
      <Link to="/">Close</Link>
    </div>
  );
};

export default TaskPage;
