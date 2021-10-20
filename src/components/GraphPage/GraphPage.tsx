import React, { useState } from "react";
import { Redirect } from "react-router";
import { useRecoilValue } from "recoil";

import useAppShortcuts from "@/components/App/useAppShortcuts";
import MenuBar from "@/components/MenuBar/MenuBar";
import Toolbar from "@/components/Toolbar/Toolbar";
import GraphCanvas from "@/components/GraphCanvas/GraphCanvas";
import NewTaskInput from "@/components/NewTaskInput/NewTaskInput";
import useFirestoreState from "@/hooks/useFirestoreState";
import useSyncFirestore from "@/hooks/useSyncFirestore";
import { authState } from "@/atoms";

import "./GraphPage.css";

const GraphPage = (): JSX.Element => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);

  const { addTask, deleteSelected } = useFirestoreState();

  useSyncFirestore();

  useAppShortcuts({
    insertMode,
    onCreateTask,
  });

  const auth = useRecoilValue(authState);

  if (auth.status === "notSignedIn") return <Redirect to="/" />;

  return (
    <>
      <button
        className="GraphPage__menu-bar-open-button iconButton"
        onClick={() => setMenuBarOpen(true)}
      />
      <MenuBar open={menuBarOpen} onClose={closeMenuBar} />

      <Toolbar
        onCreateTask={onCreateTask}
        // TODO Replace when implemented
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onComplete={() => {}}
        onDelete={deleteSelected}
      />

      <GraphCanvas />

      {insertMode && (
        <NewTaskInput
          onNewTask={(name) => {
            addTask(name);
            setInsertMode(false);
          }}
          onCancel={() => setInsertMode(false)}
        />
      )}
    </>
  );
};

export default GraphPage;
