import { useCallback } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { ProjectId, Task } from "./atoms";

import firestore from "./firestore";

type UseFirestoreState = (projectId: ProjectId) => {
  addTask: (name: string) => void;
  updateTask: (task: Task) => void;
};

const useFirestoreState: UseFirestoreState = (projectId) => {
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
    (task: Task) =>
      setDoc(doc(firestore, `projects/${projectId}/tasks`, task.id), task),
    [projectId]
  );

  return { addTask, updateTask };
};

export default useFirestoreState;
