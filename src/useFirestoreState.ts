import { addDoc, collection } from "firebase/firestore";

import firestore from "./firestore";

type UseFirestoreState = (id: string) => {
  addTask: (name: string) => void;
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
  return { addTask };
};

export default useFirestoreState;
