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
    }
    // props.tasksSelected === true
    const { onComplete, onDelete } = props;
    return (
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
