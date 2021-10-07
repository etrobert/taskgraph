import React, { useState } from "react";
import { useRecoilValue } from "recoil";

import useAppShortcuts from "@/App/useAppShortcuts";
import MenuBar from "@/App/MenuBar/MenuBar";
import Toolbar from "@/App/Toolbar/Toolbar";
import GraphCanvas from "@/App/GraphCanvas/GraphCanvas";
import NewTaskInput from "@/App/NewTaskInput/NewTaskInput";
import useFirestoreState from "@/useFirestoreState";
import useSyncFirestore from "@/useSyncFirestore";
import { anyTasksSelectedSelector } from "@/atoms";

import "./GraphPage.css";

const GraphPage = (): JSX.Element => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [linkMode, setLinkMode] = useState(false);

  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);

  const tasksSelected = useRecoilValue(anyTasksSelectedSelector);

  const { addTask } = useFirestoreState();

  useSyncFirestore();

  useAppShortcuts({
    insertMode,
    // TODO Replace when implemented
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDelete: () => {},
    onCreateTask,
  });

  return (
    <>
      <button
        className="GraphPage__menu-bar-open-button iconButton"
        onClick={() => setMenuBarOpen(true)}
      />
      <MenuBar
        open={menuBarOpen}
        onClose={closeMenuBar}
        onNewGraph={() => {
          // TODO: Fix
          // clearGraph();
          closeMenuBar();
        }}
      />

      <Toolbar
        tasksSelected={tasksSelected}
        onCreateTask={onCreateTask}
        // TODO Replace when implemented
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onComplete={() => {}}
        // TODO Replace when implemented
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onDelete={() => {}}
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
