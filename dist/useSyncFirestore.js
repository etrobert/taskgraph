import {useEffect} from "../_snowpack/pkg/react.js";
import {collection, onSnapshot} from "../_snowpack/pkg/firebase/firestore.js";
import {useRecoilValue} from "../_snowpack/pkg/recoil.js";
import {projectIdState} from "./atoms.js";
import firestore from "./firestore.js";
import useGraphState from "./App/useGraphState.js";
const useSyncFirestore = () => {
  const projectId = useRecoilValue(projectIdState);
  const {addTask, setTask, removeTask} = useGraphState();
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
};
export default useSyncFirestore;
