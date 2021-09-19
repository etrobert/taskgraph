import { addDoc, collection } from "firebase/firestore";

import firestore from "./firestore";

type UseFirebaseState = (id: string) => {
  addTask: (name: string) => void;
};

const useFirebaseState: UseFirebaseState = (id) => {
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

export default useFirebaseState;
