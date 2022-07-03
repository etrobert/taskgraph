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
import {selectedElementsState, workspaceIdState} from "../atoms.js";
import getRelatedDependencies from "../getRelatedDependencies.js";
const useFirestoreState = () => {
  const workspaceId = useRecoilValue(workspaceIdState);
  const addTask = useCallback((name) => {
    const ref = collection(firestore, `workspaces/${workspaceId}/tasks`);
    const task = {
      name,
      position: {x: 0, y: 0},
      status: "ready"
    };
    return addDoc(ref, task);
  }, [workspaceId]);
  const updateTask = useCallback((id, task) => {
    const ref = doc(firestore, `workspaces/${workspaceId}/tasks`, id);
    updateDoc(ref, task);
  }, [workspaceId]);
  const addDependency = useCallback((predecessor, successor) => {
    const ref = collection(firestore, `workspaces/${workspaceId}/dependencies`);
    const dependency = {
      predecessor,
      successor
    };
    return addDoc(ref, dependency);
  }, [workspaceId]);
  const selectedElements = useRecoilValue(selectedElementsState);
  const deleteSelected = useRecoilTransaction_UNSTABLE(({get}) => () => {
    const batch = writeBatch(firestore);
    selectedElements.tasks.forEach((taskId) => {
      batch.delete(doc(firestore, `workspaces/${workspaceId}/tasks`, taskId));
      getRelatedDependencies(get, taskId).forEach((depId) => batch.delete(doc(firestore, `workspaces/${workspaceId}/dependencies`, depId)));
    });
    selectedElements.dependencies.forEach((depId) => batch.delete(doc(firestore, `workspaces/${workspaceId}/dependencies`, depId)));
    batch.commit();
  }, [workspaceId, selectedElements]);
  return {addTask, updateTask, addDependency, deleteSelected};
};
export default useFirestoreState;
