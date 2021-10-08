import {useCallback} from "../../../_snowpack/pkg/react.js";
import {memoize} from "../../../_snowpack/pkg/lodash.js";
const useMemoizedDivs = () => useCallback(memoize((id) => document.createElement("div")), []);
export default useMemoizedDivs;
