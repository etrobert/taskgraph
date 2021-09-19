import { useCallback } from "react";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { Task } from "./atoms";

import firestore from "./firestore";

type UseFirestoreState = (id: string) => {
  addTask: (name: string) => void;
  updateTask: (task: Task) => void;
};

const useFirestoreState: UseFirestoreState = (id) => {
  const addTask = useCallback(
    (name: string) => {
      const ref = collection(firestore, `projects/${id}/tasks`);
      const task = {
        name,
        position: { x: 0, y: 0 },
        status: "ready",
      };
      return addDoc(ref, task);
    },
    [id]
  );

  const updateTask = useCallback(
    (task: Task) =>
      setDoc(doc(firestore, `projects/${id}/tasks`, task.id), task),
    [id]
  );

  return { addTask, updateTask };
};

export default useFirestoreState;
