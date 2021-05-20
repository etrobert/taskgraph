import { RefObject, useEffect, useState } from "react";

import { Size } from "./geometry";

/**
 * Uses the ResizeObserver API to watch for size changes in an HTML Element
 * @param ref A reference to the HTML Element
 * @returns `undefined` at first, then the Size
 */
const useResizeObserver = (ref: RefObject<HTMLElement>): Size | undefined => {
  const [size, setSize] = useState<Size>();

  useEffect(() => {
    if (!ref.current) return;
    const element = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.borderBoxSize) return;
        // Sometimes it's an array sometimes not
        // See https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver/ResizeObserver
        const borderBoxSize = entry.borderBoxSize[0]
          ? entry.borderBoxSize[0]
          : (entry.borderBoxSize as unknown as ResizeObserverSize);
        const { blockSize, inlineSize } = borderBoxSize;
        setSize({ width: inlineSize, height: blockSize });
      });
    });
    resizeObserver.observe(element);

    return () => resizeObserver.unobserve(element);
  }, [ref]);

  return size;
};

export default useResizeObserver;
