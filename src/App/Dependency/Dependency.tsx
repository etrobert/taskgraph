import React from "react";
import { useRecoilValue } from "recoil";

import { DependencyId, dependencyPathStateFamily } from "@/atoms";

type Props = {
  id: DependencyId;
};

const Dependency = ({ id }: Props): JSX.Element => {
  const path = useRecoilValue(dependencyPathStateFamily(id));

  return <path d={path} />;
};

export default Dependency;
