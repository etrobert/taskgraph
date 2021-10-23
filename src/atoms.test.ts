import { snapshot_UNSTABLE } from "recoil";
import {
  dependencyStateFamily,
  nextTaskState,
  tasksWithoutPredecessorState,
  workspaceState,
} from "./atoms";

describe("tasksWithoutPredecessorState", () => {
  it("should return an empty array when there are no tasks", () => {
    const snapshot = snapshot_UNSTABLE(({ set }) =>
      set(workspaceState, { tasks: [], dependencies: [] })
    );
    expect(
      snapshot.getLoadable(tasksWithoutPredecessorState).valueOrThrow()
    ).toStrictEqual([]);
  });

  it("should return the task when there is only one", () => {
    const snapshot = snapshot_UNSTABLE(({ set }) =>
      set(workspaceState, { tasks: ["task1"], dependencies: [] })
    );
    expect(
      snapshot.getLoadable(tasksWithoutPredecessorState).valueOrThrow()
    ).toStrictEqual(["task1"]);
  });

  it("should not return the tasks that have predecessors", () => {
    const snapshot = snapshot_UNSTABLE(({ set }) => {
      set(workspaceState, {
        tasks: ["task1", "task2"],
        dependencies: ["dep1"],
      });
      set(dependencyStateFamily("dep1"), {
        predecessor: "task2",
        successor: "task1",
      });
    });

    expect(
      snapshot.getLoadable(tasksWithoutPredecessorState).valueOrThrow()
    ).toStrictEqual(["task2"]);
  });
});

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
