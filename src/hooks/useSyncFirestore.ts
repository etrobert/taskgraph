import { useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { useRecoilValue } from "recoil";

import { workspaceIdState } from "@/atoms";
import firestore from "@/firestore";
import useGraphState from "@/hooks/useGraphState";

import type { Dependency, Task } from "@/types";

const useSyncFirestore = (): void => {
  const workspaceId = useRecoilValue(workspaceIdState);
  const { addTask, setTask, removeTask, addDependency, removeDependency } =
    useGraphState();

  useEffect(() => {
    const ref = collection(firestore, `workspaces/${workspaceId}/tasks`);
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
  }, [addTask, setTask, removeTask, workspaceId]);

  useEffect(() => {
    const ref = collection(firestore, `workspaces/${workspaceId}/dependencies`);
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
  }, [addDependency, removeDependency, workspaceId]);
};

export default useSyncFirestore;
