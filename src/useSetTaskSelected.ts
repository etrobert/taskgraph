import without from "lodash/without";
import { useRecoilCallback } from "recoil";

import { selectedTasksState, TaskId } from "./atoms";

type SetTaskSelected = (id: TaskId, selected: boolean) => void;

const useSetTaskSelected = (): SetTaskSelected =>
  useRecoilCallback(
    ({ set }) =>
      (id, selected) =>
        set(selectedTasksState, (selectedTasks) =>
          selected ? [...selectedTasks, id] : without(selectedTasks, id)
        ),
    []
  );

export default useSetTaskSelected;
