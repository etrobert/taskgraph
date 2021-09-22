import { useCallback } from "react";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { useRecoilValue } from "recoil";

import firestore from "./firestore";
import { projectIdState, Task, TaskId } from "./atoms";

type UseFirestoreState = () => {
  addTask: (name: string) => void;
  updateTask: (id: TaskId, task: Partial<Task>) => void;
};

const useFirestoreState: UseFirestoreState = () => {
  const projectId = useRecoilValue(projectIdState);
  const addTask = useCallback(
    (name: string) => {
      const ref = collection(firestore, `projects/${projectId}/tasks`);
      const task = {
        name,
        position: { x: 0, y: 0 },
        status: "ready",
      };
      return addDoc(ref, task);
    },
    [projectId]
  );

  const updateTask = useCallback(
    (id, task) =>
      updateDoc(doc(firestore, `projects/${projectId}/tasks`, id), task),
    [projectId]
  );

  return { addTask, updateTask };
};

export default useFirestoreState;
