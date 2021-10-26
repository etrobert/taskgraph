import React from "react";
import { useRecoilValue } from "recoil";
import { deleteField } from "@firebase/firestore";

import { selectedElementsState, taskStateFamily } from "@/atoms";
import useFirestoreState from "@/hooks/useFirestoreState";

import "./PropertiesPanel.css";

import type { Priority } from "@/types";

const PropertiesPanel = (): JSX.Element => {
  const { tasks } = useRecoilValue(selectedElementsState);
  const noTaskSelected = tasks.size === 0;
  const id = tasks.first("NO-TASK");
  const { name, priority } = useRecoilValue(taskStateFamily(id));
  const { updateTask } = useFirestoreState();

  return (
    <div className="PropertiesPanel">
      <h1>{noTaskSelected ? "No Task Selected" : name}</h1>
      {noTaskSelected || (
        <label>
          Priority:{" "}
          <select
            value={priority ?? ""}
            onChange={(event) => {
              const value = event.target.value as Priority | "";
              const newPriority = value === "" ? deleteField() : value;
              updateTask(id, { priority: newPriority });
            }}
          >
            <option value=""></option>
            <option value="veryLow">Very Low</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="veryHigh">Very High</option>
          </select>
        </label>
      )}
    </div>
  );
};

export default PropertiesPanel;
