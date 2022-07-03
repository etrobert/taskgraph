import React, { useMemo } from "react";
import stringToColor from "@/stringToColor";

import "./WorkspacesListItem.css";

type Props = {
  workspaceId: string;
};

const WorkspacesListItem = ({ workspaceId }: Props): JSX.Element => {
  const color = useMemo(() => stringToColor(workspaceId), [workspaceId]);

  return (
    <div className="WorkspacesListItem" style={{ backgroundColor: color }} />
  );
};

export default WorkspacesListItem;
