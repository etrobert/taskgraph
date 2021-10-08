import {useEffect, useMemo, useState} from "../snowpack/pkg/react.js";
const useBoxSizeObserver = (ref) => {
  const [boxSize, setBoxSize] = useState();
  const observer = useMemo(() => new ResizeObserver(() => {
    requestAnimationFrame(() => {
      if (ref.current === null)
        return;
      const {offsetWidth, offsetHeight} = ref.current;
      setBoxSize({width: offsetWidth, height: offsetHeight});
    });
  }), [ref]);
  useEffect(() => {
    if (ref.current === null)
      return;
    const element = ref.current;
    observer.observe(element);
    return () => observer.unobserve(element);
  }, [ref, observer]);
  return boxSize;
};
export default useBoxSizeObserver;
