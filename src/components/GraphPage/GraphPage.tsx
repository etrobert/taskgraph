import React, { useState } from "react";
import { Redirect } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";

import useAppShortcuts from "@/components/App/useAppShortcuts";
import MenuBar from "@/components/MenuBar/MenuBar";
import PropertiesPanel from "@/components/PropertiesPanel/PropertiesPanel";
import GraphCanvas from "@/components/GraphCanvas/GraphCanvas";
import NewTaskInput from "@/components/NewTaskInput/NewTaskInput";
import useFirestoreState from "@/hooks/useFirestoreState";
import { authState, insertModeState } from "@/atoms";

import "./GraphPage.css";

const GraphPage = (): JSX.Element => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [insertMode, setInsertMode] = useRecoilState(insertModeState);
  const { addTask } = useFirestoreState();

  useAppShortcuts();

  const auth = useRecoilValue(authState);

  if (auth.status === "notSignedIn") return <Redirect to="/" />;

  return (
    <div className="GraphPage">
      <button
        className="GraphPage__menu-bar-open-button iconButton"
        onClick={() => setMenuBarOpen(true)}
      />
      <MenuBar open={menuBarOpen} onClose={closeMenuBar} />

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

      <PropertiesPanel />
    </div>
  );
};

export default GraphPage;
