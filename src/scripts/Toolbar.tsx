import React from "react";

import "./Toolbar.css";

type Props =
  | {
      tasksSelected: false;
      linkMode: boolean;
      onChangeLinkMode: () => void;
      onCreateTask: () => void;
    }
  | {
      tasksSelected: true;
      onComplete: () => void;
      onDelete: () => void;
    };

const Toolbar = (props: Props): JSX.Element => {
  const renderButtons = () => {
    if (!props.tasksSelected) {
      const { linkMode, onChangeLinkMode, onCreateTask } = props;
      return (
        <>
          <button
            aria-label="Change Link Mode"
            onClick={onChangeLinkMode}
            className={`Toolbar__button Toolbar__change-link-mode-button ${
              linkMode ? "Toolbar__change-link-mode-button--active" : ""
            } iconButton`}
          />
          <button
            aria-label="Create Task"
            onClick={onCreateTask}
            className="Toolbar__button Toolbar__create-task-button iconButton"
          />
        </>
      );
    }
    // props.tasksSelected === true
    const { onComplete, onDelete } = props;
    return (
      <>
        <button
          aria-label="Delete Selected"
          onClick={onDelete}
          // TODO Should it be delete-selected?
          className="Toolbar__button Toolbar__delete-selected-button iconButton"
        />
        <button
          aria-label="Complete Selected"
          onClick={onComplete}
          className="Toolbar__button Toolbar__complete-selected-button iconButton"
        />
      </>
    );
  };

  return (
    <div className="Toolbar">
      {renderButtons()}

      {/* TODO Remove: Temporary element used to communicate with graph */}
      <input
        style={{ display: "none" }}
        type="checkbox"
        checked={!props.tasksSelected && props.linkMode}
        id="linkModeCheckbox"
      />
    </div>
  );
};

export default Toolbar;
