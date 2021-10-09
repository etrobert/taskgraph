import { useCallback } from "react";
import { memoize } from "lodash";

import type { MemoizedFunction } from "lodash";

import type { TaskId } from "@/types";

type MemoizedDivs = ((id: TaskId) => HTMLDivElement) & MemoizedFunction;

/**
 * Returns a memoized HTMLDivElement by TaskId
 */
const useMemoizedDivs = (): MemoizedDivs =>
  // useCallback is not able to infer deps from lodash memoize
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useCallback(
    // id is used for the memoization
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    memoize((id: TaskId) => document.createElement("div")),
    []
  );

export default useMemoizedDivs;
