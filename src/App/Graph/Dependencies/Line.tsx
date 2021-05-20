import React from "react";

import { Point } from "@/geometry";

type Props = {
  from: Point;
  to: Point;
};

const Line = ({ from, to }: Props): JSX.Element => (
  <path d={`M${from.x},${from.y} L${to.x},${to.y}`} />
);

export default Line;
