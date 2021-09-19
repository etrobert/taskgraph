import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { Task } from "./atoms";
import firestore from "./firestore";
import useGraphState from "./App/useGraphState";

const useSyncFirestore = (id: string): void => {
  const { addTask, updateTask, removeTask } = useGraphState();

  useEffect(() => {
    const ref = collection(firestore, `projects/${id}/tasks`);
    const unsubscribe = onSnapshot(ref, (snapshot) =>
      snapshot.docChanges().forEach((change) => {
        const task = { ...change.doc.data(), id: change.doc.id } as Task;
        switch (change.type) {
          case "added":
            // TODO Try to use custom type instead of DocumentData
            addTask(task);
            break;
          case "modified":
            updateTask(change.doc.id, task);
            break;
          case "removed":
            removeTask(task.id);
            break;
        }
      })
    );
    return unsubscribe;
  }, [id, addTask, updateTask, removeTask]);
};

export default useSyncFirestore;
