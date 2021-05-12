import React from "react";

import "./Toolbar.css";

type Props = {
  tasksSelected: boolean;
  linkMode: boolean;
  onChangeLinkMode: () => void;
  onCreateTask: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

type NotSelectedButtonsProps = {
  linkMode: boolean;
  onChangeLinkMode: () => void;
  onCreateTask: () => void;
};

const NotSelectedButtons = ({
  linkMode,
  onChangeLinkMode,
  onCreateTask,
}: NotSelectedButtonsProps) => (
  <>
    <button
      aria-label="Change Link Mode"
      onClick={onChangeLinkMode}
      className={`
              Toolbar__button
              Toolbar__button-change-link-mode
              ${linkMode ? "Toolbar__button-change-link-mode--active" : ""}
              iconButton
            `}
    />
    <button
      aria-label="Create Task"
      onClick={onCreateTask}
      className="Toolbar__button Toolbar__button-create-task iconButton"
    />
  </>
);

type SelectedButtonsProps = {
  onComplete: () => void;
  onDelete: () => void;
};

const SelectedButtons = ({ onComplete, onDelete }: SelectedButtonsProps) => (
  <>
    <button
      aria-label="Delete Selected"
      onClick={onDelete}
      className="Toolbar__button Toolbar__button-delete-selected iconButton"
    />
    <button
      aria-label="Complete Selected"
      onClick={onComplete}
      className="Toolbar__button Toolbar__button-complete-selected iconButton"
    />
  </>
);

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
      <SelectedButtons onComplete={onComplete} onDelete={onDelete} />
    ) : (
      <NotSelectedButtons
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
