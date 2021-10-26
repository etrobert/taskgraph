import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { anyElementsSelectedState, insertModeState } from "@/atoms";
import useFirestoreState from "@/hooks/useFirestoreState";

import SomeSelectedButtons from "./SomeSelectedButtons/SomeSelectedButtons";

import "./Toolbar.css";

const Toolbar = (): JSX.Element => {
  const anyElementsSelected = useRecoilValue(anyElementsSelectedState);
  // TODO Replace when implemented
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onComplete = () => {};
  const setInsertMode = useSetRecoilState(insertModeState);
  const { deleteSelected } = useFirestoreState();

  return (
    <div className="Toolbar">
      {anyElementsSelected && (
        <SomeSelectedButtons
          onComplete={onComplete}
          onDelete={deleteSelected}
        />
      )}
      <button
        aria-label="Create Task"
        onClick={() => setInsertMode(true)}
        className="Toolbar__button Toolbar__button-create-task iconButton"
      />
    </div>
  );
};

export default Toolbar;
