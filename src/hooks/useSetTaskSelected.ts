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
          tasks: selected ? tasks.add(id) : tasks.remove(id),
        })),
    []
  );

export default useSetTaskSelected;
