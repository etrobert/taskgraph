import PriorityEnum from "./PriorityEnum";

import type { Priority } from "./types";

const compareByPriority = (
  task1: { priority?: Priority },
  task2: { priority?: Priority }
): number =>
  PriorityEnum[task2.priority ?? "normal"] -
  PriorityEnum[task1.priority ?? "normal"];

export default compareByPriority;
