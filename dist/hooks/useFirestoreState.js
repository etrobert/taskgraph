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
import {signedInUserIdState, selectedElementsState} from "../atoms.js";
import getRelatedDependencies from "../getRelatedDependencies.js";
const useFirestoreState = () => {
  const signedInUserId = useRecoilValue(signedInUserIdState);
  const addTask = useCallback((name) => {
    const ref = collection(firestore, `workspaces/${signedInUserId}/tasks`);
    const task = {
      name,
      position: {x: 0, y: 0},
      status: "ready"
    };
    return addDoc(ref, task);
  }, [signedInUserId]);
  const updateTask = useCallback((id, task) => updateDoc(doc(firestore, `workspaces/${signedInUserId}/tasks`, id), task), [signedInUserId]);
  const addDependency = useCallback((predecessor, successor) => {
    const ref = collection(firestore, `workspaces/${signedInUserId}/dependencies`);
    const dependency = {
      predecessor,
      successor
    };
    return addDoc(ref, dependency);
  }, [signedInUserId]);
  const selectedElements = useRecoilValue(selectedElementsState);
  const deleteSelected = useRecoilTransaction_UNSTABLE(({get}) => () => {
    const batch = writeBatch(firestore);
    selectedElements.tasks.forEach((taskId) => {
      batch.delete(doc(firestore, `workspaces/${signedInUserId}/tasks`, taskId));
      getRelatedDependencies(get, taskId).forEach((depId) => batch.delete(doc(firestore, `workspaces/${signedInUserId}/dependencies`, depId)));
    });
    selectedElements.dependencies.forEach((depId) => batch.delete(doc(firestore, `workspaces/${signedInUserId}/dependencies`, depId)));
    batch.commit();
  }, [signedInUserId, selectedElements]);
  return {addTask, updateTask, addDependency, deleteSelected};
};
export default useFirestoreState;
