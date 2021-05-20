import React from "react";

import { Dependency, Task } from "@/graph";
import {
  createBox,
  getBoxCenter,
  getExpandedBox,
  intersectLineBox,
} from "@/geometry";
import { TaskSizes } from "../useTaskSizes";

type Props = {
  data: Dependency;
  tasks: Task[];
  taskSizes: TaskSizes;
};

const Dependency = ({ data, tasks, taskSizes }: Props): JSX.Element | null => {
  const predecessor = tasks.find((task) => task.name === data.predecessor);
  const successor = tasks.find((task) => task.name === data.successor);

  if (!predecessor || !successor)
    throw Error("Missing predecessor or successor");

  const predecessorSize = taskSizes[predecessor.name];
  const successorSize = taskSizes[successor.name];

  if (!predecessorSize || !successorSize) return null;

  const predecessorBox = createBox(predecessor.pos, predecessorSize);
  const successorBox = createBox(successor.pos, successorSize);

  const predecessorCenter = getBoxCenter(predecessorBox);
  const successorCenter = getBoxCenter(successorBox);

  const offset = 12;
  const pointA = intersectLineBox(
    predecessorCenter,
    successorCenter,
    getExpandedBox(predecessorBox, offset)
  );

  const pointB = intersectLineBox(
    predecessorCenter,
    successorCenter,
    getExpandedBox(successorBox, offset)
  );

  if (!pointA || !pointB) return null;

  return <path d={`M${pointA.x},${pointA.y} L${pointB.x},${pointB.y}`} />;
};

export default Dependency;
