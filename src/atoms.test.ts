import { snapshot_UNSTABLE } from "recoil";
import {
  dependencyStateFamily,
  nextTaskState,
  taskStateFamily,
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

  it("should return the task that does not have dependencies", () => {
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

    expect(snapshot.getLoadable(nextTaskState).valueOrThrow()).toBe("task2");
  });

  it("should return the task with the highest priority", () => {
    const snapshot = snapshot_UNSTABLE(({ set }) => {
      set(workspaceState, {
        tasks: ["task1", "task2"],
        dependencies: [],
      });
      set(taskStateFamily("task1"), {
        name: "task1",
        position: { x: 0, y: 0 },
        status: "ready",
        priority: "high",
      });
      set(taskStateFamily("task2"), {
        name: "task2",
        position: { x: 0, y: 0 },
        status: "ready",
        priority: "veryHigh",
      });
    });

    expect(snapshot.getLoadable(nextTaskState).valueOrThrow()).toBe("task2");
  });
});
