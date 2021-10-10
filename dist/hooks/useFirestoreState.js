import {useCallback} from "../../_snowpack/pkg/react.js";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  writeBatch
} from "../../_snowpack/pkg/firebase/firestore.js";
import {useRecoilTransaction_UNSTABLE, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import firestore from "../firestore.js";
import {projectIdState, selectedElementsState} from "../atoms.js";
import getRelatedDependencies from "../getRelatedDependencies.js";
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
  const addDependency = useCallback((predecessor, successor) => {
    const ref = collection(firestore, `projects/${projectId}/dependencies`);
    const dependency = {
      predecessor,
      successor
    };
    return addDoc(ref, dependency);
  }, [projectId]);
  const selectedElements = useRecoilValue(selectedElementsState);
  const deleteSelected = useRecoilTransaction_UNSTABLE(({get}) => () => {
    const batch = writeBatch(firestore);
    selectedElements.tasks.forEach((taskId) => {
      batch.delete(doc(firestore, `projects/${projectId}/tasks`, taskId));
      getRelatedDependencies(get, taskId).forEach((depId) => batch.delete(doc(firestore, `projects/${projectId}/dependencies`, depId)));
    });
    selectedElements.dependencies.forEach((depId) => batch.delete(doc(firestore, `projects/${projectId}/dependencies`, depId)));
    batch.commit();
  }, [projectId, selectedElements]);
  return {addTask, updateTask, addDependency, deleteSelected};
};
export default useFirestoreState;
