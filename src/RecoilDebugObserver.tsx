import { useEffect } from "react";
import { useRecoilSnapshot } from "recoil";

/**
 * Logs the modified nodes on each snapshot change
 *
 * Source: https://recoiljs.org/docs/guides/dev-tools/
 */
function RecoilDebugObserver(): null {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    console.debug("The following atoms were modified:");
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      console.debug(node.key, snapshot.getLoadable(node));
    }
  }, [snapshot]);
  return null;
}

export default RecoilDebugObserver;
