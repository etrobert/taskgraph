import {useCallback} from "../../../snowpack/pkg/react.js";
import {memoize} from "../../../snowpack/pkg/lodash.js";
const useMemoizedDivs = () => useCallback(memoize((id) => document.createElement("div")), []);
export default useMemoizedDivs;
