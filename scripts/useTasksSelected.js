import {useEffect, useState} from "../snowpack/pkg/react.js";
import {getElementById} from "./misc.js";
const useTasksSelected = () => {
  const [tasksSelected, setTasksSelected] = useState(false);
  useEffect(() => {
    const onSelectionChanged = (event) => {
      const customEvent = event;
      setTasksSelected(customEvent.detail.length > 0);
    };
    const graph = getElementById("graph");
    graph.addEventListener("selectionchanged", onSelectionChanged);
    return () => graph.removeEventListener("selectionchanged", onSelectionChanged);
  }, []);
  return tasksSelected;
};
export default useTasksSelected;
