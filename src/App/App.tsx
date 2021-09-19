import React, { useState } from "react";

import MenuBar from "./MenuBar/MenuBar";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar/Toolbar";
import useTasksSelected from "./useTasksSelected";
import GraphCanvas from "./GraphCanvas/GraphCanvas";
import NewTaskInput from "./NewTaskInput/NewTaskInput";

import "./App.css";
import useGraphState from "./useGraphState";

import { collection, addDoc, onSnapshot } from "firebase/firestore";

import firestore from "@/firestore";
import { Task } from "./atoms";

const useFirebaseCallbacks = (id: string) => {
  const addTask = (name: string) => {
    const ref = collection(firestore, `projects/${id}/tasks`);
    const task: Task = {
      id: "test",
      name,
      position: { x: 0, y: 0 },
      status: "ready",
    };
    return addDoc(ref, task);
  };
  return { addTask };
};

const useSyncFirestore = (id: string) => {
  const { addTask } = useGraphState();

  useEffect(() => {
    const ref = collection(firestore, `projects/${id}/tasks`);
    const unsubscribe = onSnapshot(ref, (snapshot) =>
      snapshot.docChanges().forEach((change) => {
        switch (change.type) {
          case "added":
            {
              // TODO Try to use custom type instead of DocumentData
              const task = change.doc.data();
              addTask(task.name);
            }
            break;
          case "modified":
            // Update task
            break;
          case "removed":
            // Remove task
            break;
        }
      })
    );
    return unsubscribe;
  }, [id, addTask]);
};

// addProject();

const App = (): JSX.Element => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [linkMode, setLinkMode] = useState(false);

  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);

  const tasksSelected = useTasksSelected();

  const { clearGraph } = useGraphState();

  const projectId = "spXxYVulTgfKcj0n1sWb";

  const { addTask } = useFirebaseCallbacks(projectId);

  useSyncFirestore(projectId);

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
        className="App__menu-bar-open-button iconButton"
        onClick={() => setMenuBarOpen(true)}
      />
      <MenuBar
        open={menuBarOpen}
        onClose={closeMenuBar}
        onNewGraph={() => {
          clearGraph();
          closeMenuBar();
        }}
      />

      <Toolbar
        tasksSelected={tasksSelected}
        linkMode={linkMode}
        onChangeLinkMode={() => setLinkMode((mode) => !mode)}
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

export default App;
