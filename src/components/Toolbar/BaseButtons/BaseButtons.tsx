import React from "react";
import { useRecoilState } from "recoil";

import { drawModeState } from "@/atoms";

type Props = {
  onCreateTask: () => void;
};

const BaseButtons = ({ onCreateTask }: Props): JSX.Element => {
  const [drawMode, setDrawMode] = useRecoilState(drawModeState);

  return (
    <>
      <button
        aria-label="Change Draw Mode"
        onClick={() => setDrawMode((current) => !current)}
        className={`
        Toolbar__button
        Toolbar__button-change-draw-mode
        ${drawMode ? "Toolbar__button-change-draw-mode--active" : ""}
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
};

export default BaseButtons;
