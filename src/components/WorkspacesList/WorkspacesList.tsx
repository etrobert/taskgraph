import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import firestore from "@/firestore";
import WorkspacesListItem from "./WorkspacesListItem";

const WorkspacesList = (): JSX.Element => {
  useEffect(() => {
    getDocs(collection(firestore, "workspaces")).then((docs) =>
      setWorkspacesList(docs.docs.map((doc) => doc.id))
    );
  }, []);

  const [workspacesList, setWorkspacesList] = useState<string[]>();

  return (
    <ul>
      {workspacesList?.map((id) => (
        <li key={id}>{<WorkspacesListItem workspaceId={id} />}</li>
      ))}
    </ul>
  );
};

export default WorkspacesList;
