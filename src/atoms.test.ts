import { snapshot_UNSTABLE } from "recoil";
import { nextTaskState, workspaceState } from "./atoms";

describe("nextTaskState", () => {
  it("should return 'NO-TASK-FOUND' when there are no tasks", () => {
    const snapshot = snapshot_UNSTABLE(({ set }) =>
      set(workspaceState, { tasks: [], dependencies: [] })
    );
    expect(snapshot.getLoadable(nextTaskState).valueOrThrow()).toBe(
      "NO-TASK-FOUND"
    );
  });

  it("should return the task if there is only one", () => {
    const snapshot = snapshot_UNSTABLE(({ set }) =>
      set(workspaceState, { tasks: ["task1"], dependencies: [] })
    );

    expect(snapshot.getLoadable(nextTaskState).valueOrThrow()).toBe("task1");
  });
});
