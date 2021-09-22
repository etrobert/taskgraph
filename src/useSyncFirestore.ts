import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useRecoilValue } from "recoil";

import { projectIdState, Task } from "./atoms";
import firestore from "./firestore";
import useGraphState from "./App/useGraphState";

const useSyncFirestore = (): void => {
  const projectId = useRecoilValue(projectIdState);
  const { addTask, setTask, removeTask } = useGraphState();

  useEffect(() => {
    const ref = collection(firestore, `projects/${projectId}/tasks`);
    const unsubscribe = onSnapshot(ref, (snapshot) =>
      snapshot.docChanges().forEach((change) => {
        const { id } = change.doc;
        const task = change.doc.data() as Task;
        switch (change.type) {
          case "added":
            addTask(id, task);
            break;
          case "modified":
            setTask(id, task);
            break;
          case "removed":
            removeTask(id);
            break;
        }
      })
    );
    return unsubscribe;
  }, [projectId, addTask, setTask, removeTask]);
};

export default useSyncFirestore;
