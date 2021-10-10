import without from "lodash/without";
import { useRecoilCallback } from "recoil";

import { selectedElementsState } from "@/atoms";

import type { DependencyId } from "@/types";

type SetDependencySelected = (id: DependencyId, selected: boolean) => void;

const useSetDependencySelected = (): SetDependencySelected =>
  useRecoilCallback(
    ({ set }) =>
      (id, selected) =>
        set(selectedElementsState, ({ tasks, dependencies }) => ({
          tasks,
          dependencies: selected
            ? [...dependencies, id]
            : without(dependencies, id),
        })),
    []
  );

export default useSetDependencySelected;
