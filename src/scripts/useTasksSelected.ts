import { useEffect, useState } from "react";
import { getElementById } from "./misc";

/**
 * Update tasksSelected when the graph sends a selectionchanged event
 */
const useTasksSelected = (): boolean => {
  const [tasksSelected, setTasksSelected] = useState(false);

  useEffect(() => {
    const onSelectionChanged = (event: Event) => {
      const customEvent = event as CustomEvent<HTMLElement[]>;
      setTasksSelected(customEvent.detail.length > 0);
    };
    const graph = getElementById("graph");
    graph.addEventListener("selectionchanged", onSelectionChanged);
    return () =>
      graph.removeEventListener("selectionchanged", onSelectionChanged);
  }, []);

  return tasksSelected;
};

export default useTasksSelected;
