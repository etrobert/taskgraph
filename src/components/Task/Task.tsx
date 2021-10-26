import React from "react";
import { useRecoilValue } from "recoil";
import classNames from "classnames";
import { Link } from "react-router-dom";

import {
  isNextTaskStateFamily,
  taskSelectedStateFamily,
  taskStateFamily,
} from "@/atoms";

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
  const { name, status, priority } = useRecoilValue(taskStateFamily(id));
  const isNextTask = useRecoilValue(isNextTaskStateFamily(id));
  const selected = useRecoilValue(taskSelectedStateFamily(id));

  return (
    <div
      className={classNames("Task", {
        "Task--completed": status === "completed",
        "Task--selected": selected,
        "Task--next": isNextTask,
      })}
      id={id}
    >
      {priority !== undefined && (
        <div
          className={classNames("Task__priority", {
            "Task__priority--very-low": priority === "veryLow",
            "Task__priority--low": priority === "low",
            "Task__priority--normal": priority === "normal",
            "Task__priority--high": priority === "high",
            "Task__priority--very-high": priority === "veryHigh",
          })}
        />
      )}
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
