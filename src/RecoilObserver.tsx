import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import type { RecoilValue } from "recoil";

type Props<T> = {
  node: RecoilValue<T>;
  onChange: (value: T) => void;
};

/**
 * Inspects changes on node
 *
 * Source: https://recoiljs.org/docs/guides/testing/
 */
const RecoilObserver = <T,>({ node, onChange }: Props<T>): null => {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
};

export default RecoilObserver;
