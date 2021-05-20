import { Size } from "@/useResizeObserver";
import { useState } from "react";

type TaskSizes = Partial<Record<string, Size>>;

type UseTaskSizes = () => {
  taskSizes: TaskSizes;
  setTaskSize: (id: string, size: Size) => void;
};

const useTaskSizes: UseTaskSizes = () => {
  const [taskSizes, setTaskSizes] = useState<TaskSizes>({});

  const setTaskSize = (id: string, size: Size) =>
    setTaskSizes((sizes) =>
      // The conditional prevents infinite loop
      size === sizes[id] ? sizes : { ...sizes, [id]: size }
    );

  return { taskSizes, setTaskSize };
};

export default useTaskSizes;
