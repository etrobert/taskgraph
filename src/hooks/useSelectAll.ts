import { useRecoilTransaction_UNSTABLE } from "recoil";
import { Set } from "immutable";

import { selectedElementsState, workspaceState } from "@/atoms";

/**
 * Returns a Recoil Transaction that selects all tasks and dependencies.
 */
const useSelectAll = (): (() => void) =>
  useRecoilTransaction_UNSTABLE(
    ({ get, set }) =>
      () => {
        const { tasks, dependencies } = get(workspaceState);
        set(selectedElementsState, {
          tasks: Set(tasks),
          dependencies: Set(dependencies),
        });
      },
    []
  );

export default useSelectAll;
