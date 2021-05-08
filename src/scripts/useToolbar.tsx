import React from "react";
import { useState } from "react";
import { completeSelected, deleteSelected } from "./graph";
import { getElementById } from "./misc";
import { saveToLocalStorage } from "./storage";
import Toolbar from "./Toolbar";

const useToolbar = (tasksSelected: boolean): JSX.Element => {
  const [linkMode, setLinkMode] = useState(false);

  const onCreateTask = () => {
    const newTask = getElementById("newTask");
    newTask.style.display = "block";
    newTask.focus();
  };

  const onChangeLinkMode = () => setLinkMode((state) => !state);

  const onComplete = () => {
    completeSelected();
    saveToLocalStorage();
  };

  const onDelete = () => {
    deleteSelected();
    saveToLocalStorage();
  };

  return tasksSelected ? (
    <Toolbar tasksSelected={true} onComplete={onComplete} onDelete={onDelete} />
  ) : (
    <Toolbar
      tasksSelected={false}
      linkMode={linkMode}
      onCreateTask={onCreateTask}
      onChangeLinkMode={onChangeLinkMode}
    />
  );
};

export default useToolbar;
