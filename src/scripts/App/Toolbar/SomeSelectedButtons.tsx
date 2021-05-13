import React from "react";

type Props = {
  onComplete: () => void;
  onDelete: () => void;
};

const SomeSelectedButtons = ({ onComplete, onDelete }: Props): JSX.Element => (
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

export default SomeSelectedButtons;
