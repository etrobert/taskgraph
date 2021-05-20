import React from "react";

import { Dependency, Task } from "@/graph";
import {
  createBox,
  getBoxCenter,
  getExpandedBox,
  intersectLineBox,
  Point,
} from "@/geometry";

import { TaskSizes } from "../useTaskSizes";
import Line from "./Line";
import { offset } from "./Dependency";

type Props = {
  predecessorId: string;
  to: Point;
  tasks: Task[];
  taskSizes: TaskSizes;
};

const Dependency = ({
  predecessorId,
  to,
  tasks,
  taskSizes,
}: Props): JSX.Element | null => {
  const predecessor = tasks.find((task) => task.name === predecessorId);

  if (!predecessor) throw Error("Missing predecessor");

  const predecessorSize = taskSizes[predecessor.name];

  if (!predecessorSize) return null;

  const predecessorBox = createBox(predecessor.pos, predecessorSize);

  const predecessorCenter = getBoxCenter(predecessorBox);

  const from = intersectLineBox(
    predecessorCenter,
    to,
    getExpandedBox(predecessorBox, offset)
  );

  if (!from) return null;

  return <Line from={from} to={to} />;
};

export default Dependency;
