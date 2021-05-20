import React from "react";

import { Graph } from "@/graph";

import Dependency from "./Dependency";
import { TaskSizes } from "../useTaskSizes";

type Props = {
  graph: Graph;
  taskSizes: TaskSizes;
};

const Dependencies = ({ graph, taskSizes }: Props): JSX.Element => {
  return (
    <svg id="arrows">
      <defs>
        <marker
          id="Triangle"
          viewBox="0 0 5 5"
          refX="2"
          refY="2.5"
          markerWidth="2"
          markerHeight="2"
          orient="auto"
        >
          <path
            d="M 0 0 L 5 2.5 L 0 5 z"
            className="link-arrow-triangle-path"
          />
        </marker>
      </defs>
      {graph.dependencies.map((dep) => (
        <Dependency
          key={`${dep.predecessor}-${dep.successor}`}
          data={dep}
          tasks={graph.tasks}
          taskSizes={taskSizes}
        />
      ))}
    </svg>
  );
};

export default Dependencies;
