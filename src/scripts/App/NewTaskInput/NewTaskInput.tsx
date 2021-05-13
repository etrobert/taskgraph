import React, { KeyboardEventHandler, useRef } from "react";
import { AddTask } from "@/graph";

import "./NewTaskInput.css";

type Props = {
  onNewTask: (newTask: AddTask) => void;
  onCancel: () => void;
};

const NewTask = ({ onNewTask, onCancel }: Props): JSX.Element => {
  const ref = useRef<HTMLInputElement>(null);

  const onKeyPress: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (!ref.current) return;
    if (event.key === "Enter") {
      if (ref.current.value) onNewTask({ name: ref.current.value });
      else onCancel();
    }
  };

  return (
    <input
      className="NewTask"
      type="text"
      onKeyPress={onKeyPress}
      onBlur={onCancel}
      ref={ref}
      autoFocus
    />
  );
};

export default NewTask;
