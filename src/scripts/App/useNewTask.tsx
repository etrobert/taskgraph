import { AddTask, addTask } from "@/graph";
import { saveToLocalStorage } from "@/storage";
import React from "react";
import { useState } from "react";
import NewTask from "./NewTask/NewTask";

type UseNewTask = () => {
  insertMode: boolean;
  openNewTask: () => void;
  newTask: JSX.Element | null;
};

const useNewTask: UseNewTask = () => {
  const [insertMode, setInsertMode] = useState(false);

  const renderNewTask = () => {
    if (!insertMode) return null;

    const onNewTask = (task: AddTask) => {
      addTask(task);
      saveToLocalStorage();
      setInsertMode(false);
    };

    const onCancel = () => setInsertMode(false);

    return <NewTask onNewTask={onNewTask} onCancel={onCancel} />;
  };

  const newTask = renderNewTask();
  const openNewTask = () => setInsertMode(true);

  return { insertMode, newTask, openNewTask };
};

export default useNewTask;
