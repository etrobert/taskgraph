import {useEffect} from "../_snowpack/pkg/react.js";
import {useRecoilValue} from "../_snowpack/pkg/recoil.js";
const RecoilObserver = ({node, onChange}) => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};
export default RecoilObserver;
