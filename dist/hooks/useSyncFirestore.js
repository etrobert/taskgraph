import {useEffect} from "../../_snowpack/pkg/react.js";
import {collection, onSnapshot} from "../../_snowpack/pkg/firebase/firestore.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {workspaceIdState} from "../atoms.js";
import firestore from "../firestore.js";
import useGraphState from "./useGraphState.js";
const useSyncFirestore = () => {
  const workspaceId = useRecoilValue(workspaceIdState);
  const {addTask, setTask, removeTask, addDependency, removeDependency} = useGraphState();
  useEffect(() => {
    const ref = collection(firestore, `workspaces/${workspaceId}/tasks`);
    const unsubscribe = onSnapshot(ref, (snapshot) => snapshot.docChanges().forEach((change) => {
      const {id} = change.doc;
      const task = change.doc.data();
      switch (change.type) {
        case "added":
          addTask(id, task);
          break;
        case "modified":
          setTask(id, task);
          break;
        case "removed":
          removeTask(id);
          break;
      }
    }));
    return unsubscribe;
  }, [addTask, setTask, removeTask, workspaceId]);
  useEffect(() => {
    const ref = collection(firestore, `workspaces/${workspaceId}/dependencies`);
    const unsubscribe = onSnapshot(ref, (snapshot) => snapshot.docChanges().forEach((change) => {
      const {id} = change.doc;
      const dependency = change.doc.data();
      switch (change.type) {
        case "added":
          addDependency(id, dependency);
          break;
        case "modified":
          break;
        case "removed":
          removeDependency(id);
          break;
      }
    }));
    return unsubscribe;
  }, [addDependency, removeDependency, workspaceId]);
};
export default useSyncFirestore;
