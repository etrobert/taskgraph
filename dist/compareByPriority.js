import PriorityEnum from "./PriorityEnum.js";
const compareByPriority = (task1, task2) => PriorityEnum[task2.priority ?? "normal"] - PriorityEnum[task1.priority ?? "normal"];
export default compareByPriority;
