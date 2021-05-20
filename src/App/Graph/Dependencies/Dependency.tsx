import React from "react";

import { Dependency, Task } from "@/graph";
import { Box, getBoxCenter, Point } from "@/geometry";
import { Size } from "@/useResizeObserver";
import { TaskSizes } from "../useTaskSizes";

type Props = {
  data: Dependency;
  tasks: Task[];
  taskSizes: TaskSizes;
};

const createBox = ({ x, y }: Point, { width, height }: Size): Box => ({
  left: x,
  top: y,
  right: x + width - 1,
  width,
  height,
  bottom: y + height - 1,
});

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

  return (
    <path
      d={`M${predecessorCenter.x},${predecessorCenter.y}
          L${successorCenter.x},${successorCenter.y}`}
    />
  );
};

export default Dependency;
