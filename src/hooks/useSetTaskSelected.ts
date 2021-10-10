import without from "lodash/without";
import { useRecoilCallback } from "recoil";

import { selectedElementsState } from "@/atoms";

import type { TaskId } from "@/types";

type SetTaskSelected = (id: TaskId, selected: boolean) => void;

const useSetTaskSelected = (): SetTaskSelected =>
  useRecoilCallback(
    ({ set }) =>
      (id, selected) =>
        set(selectedElementsState, ({ tasks, dependencies }) => ({
          dependencies,
          tasks: selected ? [...tasks, id] : without(tasks, id),
        })),
    []
  );

export default useSetTaskSelected;
