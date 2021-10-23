import { Priority } from "./types";

const priorityToNumberMap = {
  veryLow: 0,
  low: 1,
  normal: 2,
  high: 3,
  veryHigh: 4,
};

const priorityToNumber = (priority: Priority) => priorityToNumberMap[priority];

const compareByPriority = (
  task1: { priority?: Priority },
  task2: { priority?: Priority }
): number =>
  priorityToNumber(task2.priority ?? "normal") -
  priorityToNumber(task1.priority ?? "normal");

export default compareByPriority;
