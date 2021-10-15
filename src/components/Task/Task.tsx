import React from "react";
import { useRecoilValue } from "recoil";

import { taskSelectedStateFamily, taskStateFamily } from "@/atoms";
import classNames from "@/classNames";

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
      className={classNames([
        "Task",
        status === "completed" && "Task--completed",
        selected && "Task--selected",
      ])}
      id={id}
    >
      {name}
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
