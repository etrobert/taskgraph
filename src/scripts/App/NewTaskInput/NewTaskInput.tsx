import React, { useState } from "react";
import { AddTask } from "@/graph";

import "./NewTaskInput.css";

type Props = {
  onNewTask: (newTask: AddTask) => void;
  onCancel: () => void;
};

const NewTask = ({ onNewTask, onCancel }: Props): JSX.Element => {
  const [name, setName] = useState("");

  return (
    <form
      onSubmit={(event) => {
        // Prevent the page from reloading
        event.preventDefault();
        if (name) onNewTask({ name });
        else onCancel();
      }}
    >
      <input
        className="NewTask"
        type="text"
        onChange={(event) => setName(event.target.value)}
        onBlur={onCancel}
        value={name}
        autoFocus
      />
    </form>
  );
};

export default NewTask;
