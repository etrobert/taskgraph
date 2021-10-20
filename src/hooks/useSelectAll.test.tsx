import React, { useEffect } from "react";
import { RecoilRoot } from "recoil";
import { render } from "@testing-library/react";
import { Set } from "immutable";

import RecoilObserver from "@/RecoilObserver";
import { selectedElementsState, workspaceState } from "@/atoms";

import useSelectAll from "./useSelectAll";

const Test = () => {
  const selectAll = useSelectAll();
  useEffect(() => selectAll());
  return null;
};

describe("useSelectAll", () => {
  it("does nothing when the graph is empty", () => {
    const onSelectedElementsChange = jest.fn();

    render(
      <RecoilRoot>
        <RecoilObserver
          node={selectedElementsState}
          onChange={onSelectedElementsChange}
        />
        <Test />
      </RecoilRoot>
    );

    expect(onSelectedElementsChange).toHaveBeenCalledTimes(2);
    expect(onSelectedElementsChange).toHaveBeenCalledWith({
      tasks: Set(),
      dependencies: Set(),
    }); // Initial State
    expect(onSelectedElementsChange).toHaveBeenCalledWith({
      tasks: Set(),
      dependencies: Set(),
    });
  });

  it("selects all tasks and dependencies", () => {
    const onSelectedElementsChange = jest.fn();

    const workspace = {
      tasks: ["task1", "task2"],
      dependencies: ["dep1", "dep2"],
    };

    render(
      <RecoilRoot initializeState={({ set }) => set(workspaceState, workspace)}>
        <RecoilObserver
          node={selectedElementsState}
          onChange={onSelectedElementsChange}
        />
        <Test />
      </RecoilRoot>
    );

    expect(onSelectedElementsChange).toHaveBeenCalledTimes(2);
    expect(onSelectedElementsChange).toHaveBeenCalledWith({
      tasks: Set(),
      dependencies: Set(),
    }); // Initial state
    expect(onSelectedElementsChange).toHaveBeenCalledWith({
      tasks: Set(workspace.tasks),
      dependencies: Set(workspace.dependencies),
    });
  });
});
