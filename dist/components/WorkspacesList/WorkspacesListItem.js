import React, {useMemo} from "../../../_snowpack/pkg/react.js";
import {Link} from "../../../_snowpack/pkg/react-router-dom.js";
import stringToColor from "../../stringToColor.js";
import "./WorkspacesListItem.css.proxy.js";
const WorkspacesListItem = ({workspaceId}) => {
  const color = useMemo(() => stringToColor(workspaceId), [workspaceId]);
  return /* @__PURE__ */ React.createElement(Link, {
    to: `/workspaces/${workspaceId}`
  }, /* @__PURE__ */ React.createElement("div", {
    className: "WorkspacesListItem",
    style: {backgroundColor: color}
  }));
};
export default WorkspacesListItem;
