import React from "react";

type Props = {
  linkMode: boolean;
  onChangeLinkMode: () => void;
  onCreateTask: () => void;
};

const NotSelectedButtons = ({
  linkMode,
  onChangeLinkMode,
  onCreateTask,
}: Props): JSX.Element => (
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

export default NotSelectedButtons;
