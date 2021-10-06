import {useCallback} from "../snowpack/pkg/react.js";
import {addDoc, collection, doc, updateDoc} from "../snowpack/pkg/firebase/firestore.js";
import {useRecoilValue} from "../snowpack/pkg/recoil.js";
import firestore from "./firestore.js";
import {projectIdState} from "./atoms.js";
const useFirestoreState = () => {
  const projectId = useRecoilValue(projectIdState);
  const addTask = useCallback((name) => {
    const ref = collection(firestore, `projects/${projectId}/tasks`);
    const task = {
      name,
      position: {x: 0, y: 0},
      status: "ready"
    };
    return addDoc(ref, task);
  }, [projectId]);
  const updateTask = useCallback((id, task) => updateDoc(doc(firestore, `projects/${projectId}/tasks`, id), task), [projectId]);
  return {addTask, updateTask};
};
export default useFirestoreState;
