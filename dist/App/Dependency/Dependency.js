import React from "../../../snowpack/pkg/react.js";
import {useRecoilValue} from "../../../snowpack/pkg/recoil.js";
import {dependencyPathSelectorFamily} from "../../atoms.js";
const Dependency = ({id}) => {
  const path = useRecoilValue(dependencyPathSelectorFamily(id));
  return /* @__PURE__ */ React.createElement("path", {
    d: path
  });
};
export default Dependency;
