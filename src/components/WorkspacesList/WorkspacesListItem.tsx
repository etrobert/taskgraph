import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import stringToColor from "@/stringToColor";

import "./WorkspacesListItem.css";

type Props = {
  workspaceId: string;
};

const WorkspacesListItem = ({ workspaceId }: Props): JSX.Element => {
  const color = useMemo(() => stringToColor(workspaceId), [workspaceId]);

  return (
    <Link to={`/workspaces/${workspaceId}`}>
      <div className="WorkspacesListItem" style={{ backgroundColor: color }} />
    </Link>
  );
};

export default WorkspacesListItem;
