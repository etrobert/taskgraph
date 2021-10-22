import React from "react";
import { useRecoilValue } from "recoil";
import classNames from "classnames";
import { Link } from "react-router-dom";

import { taskSelectedStateFamily, taskStateFamily } from "@/atoms";

import type { TaskId } from "@/types";
import type { EdgeHandlesInstance } from "cytoscape-edgehandles";
import type Cy from "cytoscape";

import "./Task.css";

type Props = {
  id: TaskId;
  edgeHandles?: EdgeHandlesInstance;
  cy?: Cy.Core;
};

const Task = ({ id, cy, edgeHandles }: Props): JSX.Element => {
  const { name, status } = useRecoilValue(taskStateFamily(id));

  const selected = useRecoilValue(taskSelectedStateFamily(id));

  return (
    <div
      className={classNames("Task", {
        "Task--completed": status === "completed",
        "Task--selected": selected,
      })}
      id={id}
    >
      {name}
      <Link className="iconButton Task__edit-button" to={`/task/${id}`} />
      <div
        className="Task__handle"
        onPointerDown={() => {
          if (cy === undefined || edgeHandles === undefined) return;
          const node = cy.$(`#${id}`);
          // Disallow moving the node while we're in dependency creation
          node.ungrabify();
          // Disallow moving the background
          cy.userPanningEnabled(false);
          // @ts-expect-error Wrong types: start takes a Cytoscape node, not a string
          edgeHandles.start(node);
        }}
      />
    </div>
  );
};

export default Task;
