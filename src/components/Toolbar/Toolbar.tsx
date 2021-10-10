import React from "react";
import { useRecoilValue } from "recoil";

import { anyElementsSelectedState } from "@/atoms";

import NoneSelectedButtons from "./NoneSelectedButtons/NoneSelectedButtons";
import SomeSelectedButtons from "./SomeSelectedButtons/SomeSelectedButtons";

import "./Toolbar.css";

type Props = {
  onCreateTask: () => void;
  onComplete: () => void;
  onDelete: () => void;
};

const Toolbar = ({
  onCreateTask,
  onComplete,
  onDelete,
}: Props): JSX.Element => {
  const anyElementsSelected = useRecoilValue(anyElementsSelectedState);

  return (
    <div className="Toolbar">
      {anyElementsSelected ? (
        <SomeSelectedButtons onComplete={onComplete} onDelete={onDelete} />
      ) : (
        <NoneSelectedButtons onCreateTask={onCreateTask} />
      )}
    </div>
  );
};

export default Toolbar;
