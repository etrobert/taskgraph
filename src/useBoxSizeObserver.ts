import { RefObject, useEffect, useMemo, useState } from "react";
import { BoxSize } from "./App/atoms";

const useBoxSizeObserver = <T extends HTMLElement>(
  ref: RefObject<T>
): BoxSize | undefined => {
  const [boxSize, setBoxSize] = useState<BoxSize>();

  const observer = useMemo(
    () =>
      // TODO According to the Source, it is way more performant to have only one ResizeObserver
      // Source: https://www.npmjs.com/package/@react-hook/resize-observer
      new ResizeObserver(() => {
        // requestAnimationFrame is used to get around a browser error
        // Source: https://stackoverflow.com/a/58701523
        requestAnimationFrame(() => {
          if (ref.current === null) return;
          const { offsetWidth, offsetHeight } = ref.current;
          setBoxSize({ width: offsetWidth, height: offsetHeight });
        });
      }),
    [ref]
  );

  useEffect(() => {
    if (ref.current === null) return;
    const element = ref.current;
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, observer]);

  return boxSize;
};

export default useBoxSizeObserver;
