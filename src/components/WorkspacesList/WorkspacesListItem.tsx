import React, { useMemo } from "react";

import "./WorkspacesListItem.css";

/**
 * Hashing algorithm
 *
 * Source: https://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
 */
function djb2(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i); /* hash * 33 + c */
  }
  return hash;
}

/**
 * Generates a seemingly unique color from a string
 *
 * Source: https://stackoverflow.com/questions/11120840/hash-string-into-rgb-color
 */
function hashStringToColor(str: string) {
  const hash = djb2(str);
  const r = (hash & 0xff0000) >> 16;
  const g = (hash & 0x00ff00) >> 8;
  const b = hash & 0x0000ff;
  return (
    "#" +
    ("0" + r.toString(16)).substr(-2) +
    ("0" + g.toString(16)).substr(-2) +
    ("0" + b.toString(16)).substr(-2)
  );
}

type Props = {
  workspaceId: string;
};

const WorkspacesListItem = ({ workspaceId }: Props): JSX.Element => {
  const color = useMemo(() => hashStringToColor(workspaceId), [workspaceId]);

  return (
    <div className="WorkspacesListItem" style={{ backgroundColor: color }} />
  );
};

export default WorkspacesListItem;
