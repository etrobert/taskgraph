import React from "react";

import { Dependency, Task } from "@/graph";

type Props = {
  data: Dependency;
  tasks: Task[];
};

const Dependency = ({ data, tasks }: Props): JSX.Element => {
  const predecessor = tasks.find((task) => task.name === data.predecessor);
  const successor = tasks.find((task) => task.name === data.successor);

  if (!predecessor || !successor)
    throw Error("Missing predecessor or successor");

  return (
    <path
      d={`M${predecessor.pos.x},${predecessor.pos.y}
          L${successor.pos.x},${successor.pos.y}`}
    />
  );
};

export default Dependency;
