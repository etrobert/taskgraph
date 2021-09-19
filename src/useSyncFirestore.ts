import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";

import { ProjectId, Task } from "./atoms";
import firestore from "./firestore";
import useGraphState from "./App/useGraphState";

const useSyncFirestore = (projectId: ProjectId): void => {
  const { addTask, updateTask, removeTask } = useGraphState();

  useEffect(() => {
    const ref = collection(firestore, `projects/${projectId}/tasks`);
    const unsubscribe = onSnapshot(ref, (snapshot) =>
      snapshot.docChanges().forEach((change) => {
        const { id } = change.doc;
        const task = change.doc.data() as Task;
        switch (change.type) {
          case "added":
            // TODO Try to use custom type instead of DocumentData
            addTask(id, task);
            break;
          case "modified":
            updateTask(id, task);
            break;
          case "removed":
            removeTask(id);
            break;
        }
      })
    );
    return unsubscribe;
  }, [projectId, addTask, updateTask, removeTask]);
};

export default useSyncFirestore;
