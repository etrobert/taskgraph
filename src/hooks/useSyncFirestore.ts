import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useRecoilValue } from "recoil";

import { projectIdState } from "@/atoms";
import firestore from "@/firestore";
import useGraphState from "@/hooks/useGraphState";

import type { Dependency, Task } from "@/types";

const useSyncFirestore = (): void => {
  const projectId = useRecoilValue(projectIdState);
  const { addTask, setTask, removeTask, addDependency, removeDependency } =
    useGraphState();

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

  useEffect(() => {
    const ref = collection(firestore, `projects/${projectId}/dependencies`);
    const unsubscribe = onSnapshot(ref, (snapshot) =>
      snapshot.docChanges().forEach((change) => {
        const { id } = change.doc;
        const dependency = change.doc.data() as Dependency;
        switch (change.type) {
          case "added":
            addDependency(id, dependency);
            break;
          case "modified":
            // setDependency(id, task);
            break;
          case "removed":
            removeDependency(id);
            break;
        }
      })
    );
    return unsubscribe;
  }, [projectId, addDependency, removeDependency]);
};

export default useSyncFirestore;
