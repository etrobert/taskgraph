import {useEffect} from "../../_snowpack/pkg/react.js";
import {collection, onSnapshot} from "../../_snowpack/pkg/firebase/firestore.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {projectIdState} from "../atoms.js";
import firestore from "../firestore.js";
import useGraphState from "./useGraphState.js";
const useSyncFirestore = () => {
  const projectId = useRecoilValue(projectIdState);
  const {addTask, setTask, removeTask, addDependency, removeDependency} = useGraphState();
  useEffect(() => {
    const ref = collection(firestore, `projects/${projectId}/tasks`);
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
  }, [projectId, addTask, setTask, removeTask]);
  useEffect(() => {
    const ref = collection(firestore, `projects/${projectId}/dependencies`);
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
  }, [projectId, addDependency, removeDependency]);
};
export default useSyncFirestore;
