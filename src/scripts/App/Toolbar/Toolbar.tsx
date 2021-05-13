import React from "react";
import NoneSelectedButtons from "./NoneSelectedButtons";
import SomeSelectedButtons from "./SomeSelectedButtons";

import "./Toolbar.css";

type Props = {
  tasksSelected: boolean;
  linkMode: boolean;
  onChangeLinkMode: () => void;
  onCreateTask: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

const Toolbar = ({
  tasksSelected,
  linkMode,
  onChangeLinkMode,
  onCreateTask,
  onComplete,
  onDelete,
}: Props): JSX.Element => (
  <div className="Toolbar">
    {tasksSelected ? (
      <SomeSelectedButtons onComplete={onComplete} onDelete={onDelete} />
    ) : (
      <NoneSelectedButtons
        linkMode={linkMode}
        onChangeLinkMode={onChangeLinkMode}
        onCreateTask={onCreateTask}
      />
    )}

    {/* TODO Remove: Temporary element used to communicate with graph */}
    <input
      style={{ display: "none" }}
      type="checkbox"
      checked={!tasksSelected && linkMode}
      id="linkModeCheckbox"
      readOnly
    />
  </div>
);

export default Toolbar;
