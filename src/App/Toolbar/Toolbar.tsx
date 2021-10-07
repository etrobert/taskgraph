import React from "react";

import NoneSelectedButtons from "./NoneSelectedButtons/NoneSelectedButtons";
import SomeSelectedButtons from "./SomeSelectedButtons/SomeSelectedButtons";

import "./Toolbar.css";

type Props = {
  tasksSelected: boolean;
  onCreateTask: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

const Toolbar = ({
  tasksSelected,
  onCreateTask,
  onComplete,
  onDelete,
}: Props): JSX.Element => (
  <div className="Toolbar">
    {tasksSelected ? (
      <SomeSelectedButtons onComplete={onComplete} onDelete={onDelete} />
    ) : (
      <NoneSelectedButtons onCreateTask={onCreateTask} />
    )}
  </div>
);

export default Toolbar;
