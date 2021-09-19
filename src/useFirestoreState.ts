import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { Task } from "./atoms";

import firestore from "./firestore";

type UseFirestoreState = (id: string) => {
  addTask: (name: string) => void;
  updateTask: (task: Task) => void;
};

const useFirestoreState: UseFirestoreState = (id) => {
  const addTask = (name: string) => {
    const ref = collection(firestore, `projects/${id}/tasks`);
    const task = {
      name,
      position: { x: 0, y: 0 },
      status: "ready",
    };
    return addDoc(ref, task);
  };

  // TODO Cache
  const updateTask = (task: Task) =>
    setDoc(doc(firestore, `projects/${id}/tasks`, task.id), task);

  return { addTask, updateTask };
};

export default useFirestoreState;
