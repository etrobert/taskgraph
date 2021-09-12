import { useRecoilCallback } from "recoil";
import { graphState } from "./atoms";

type UseGraphState = () => {
  clearGraph: () => void;
};

const useGraphState: UseGraphState = () => {
  const clearGraph = useRecoilCallback(
    ({ set }) =>
      () =>
        set(graphState, { tasks: [], dependencies: [] }),
    []
  );
  return { clearGraph };
};

export default useGraphState;
