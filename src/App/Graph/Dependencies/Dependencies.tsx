import { Graph } from "@/graph";
import React from "react";

type Props = {
  graph: Graph;
};

const Dependencies = ({ graph }: Props): JSX.Element => {
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
      {graph.dependencies.map((dep) => {
        const predecessor = graph.tasks.find(
          (task) => task.name === dep.predecessor
        );
        const successor = graph.tasks.find(
          (task) => task.name === dep.successor
        );
        if (!predecessor || !successor)
          throw Error("Missing predecessor or successor");
        return (
          <path
            key={`${dep.predecessor}-${dep.successor}`}
            d={`M${predecessor.pos.x},${predecessor.pos.y} L${successor.pos.x},${successor.pos.y}`}
          />
        );
      })}
    </svg>
  );
};

export default Dependencies;
