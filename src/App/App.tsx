import React, { useState } from "react";

import MenuBar from "./MenuBar/MenuBar";
import useAppShortcuts from "./useAppShortcuts";
import Toolbar from "./Toolbar/Toolbar";
import useTasksSelected from "./useTasksSelected";
import GraphCanvas from "./GraphCanvas/GraphCanvas";
import NewTaskInput from "./NewTaskInput/NewTaskInput";

import "./App.css";
import useGraphState from "./useGraphState";

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3Le2ZBbGHEzjgk3yCNxh3Ioj8iNIC-EY",
  authDomain: "taskgraph-e9cf9.firebaseapp.com",
  databaseURL:
    "https://taskgraph-e9cf9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "taskgraph-e9cf9",
  storageBucket: "taskgraph-e9cf9.appspot.com",
  messagingSenderId: "289117132023",
  appId: "1:289117132023:web:10e62360aa751864e06ff2",
  measurementId: "G-DKBYJ7EZBY",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

// ARCHITECTURE DECISION:
// Use a collection projects
// Each document contains a Map of Arrays of Maps like so:
// {
//   tasks: [{
//     id: '',
//     name: '',
//     position: {
//       x: 0,
//       y: 0,
//     }
//   }],
//   dependencies: []
// }
// When the size of a project will grow above 1MB it will be time to change

const mockTask = {
  id: "id-123",
  name: "hello",
  status: "ready",
  position: {
    x: 2,
    y: 2,
  },
};

const addProject = async () => {
  const ref = collection(firestore, "projects");
  await addDoc(ref, {
    tasks: [mockTask, mockTask],
    dependencies: [],
  });
};

const useSyncFirestore = (id: string) => {
  const ref = doc(firestore, "projects", id);
  useEffect(() => {
    const unsubscribe = onSnapshot(ref, (snapshot) =>
      console.log(snapshot.data())
    );
    return unsubscribe;
  });
};

// addProject();

const App = (): JSX.Element => {
  const [menuBarOpen, setMenuBarOpen] = useState(false);
  const closeMenuBar = () => setMenuBarOpen(false);

  const [linkMode, setLinkMode] = useState(false);

  const [insertMode, setInsertMode] = useState(false);
  const onCreateTask = () => setInsertMode(true);

  const tasksSelected = useTasksSelected();

  const { addTask, clearGraph } = useGraphState();

  useAppShortcuts({
    insertMode,
    // TODO Replace when implemented
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onDelete: () => {},
    onCreateTask,
  });

  useSyncFirestore("spXxYVulTgfKcj0n1sWb");

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
