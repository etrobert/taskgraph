import { useCallback } from "react";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { useRecoilTransaction_UNSTABLE, useRecoilValue } from "recoil";

import firestore from "@/firestore";
import { projectIdState, selectedElementsState } from "@/atoms";
import getRelatedDependencies from "@/getRelatedDependencies";

import type { Task, TaskId } from "@/types";

type UseFirestoreState = () => {
  addTask: (name: string) => void;
  updateTask: (id: TaskId, task: Partial<Task>) => void;
  addDependency: (predecessor: TaskId, successor: TaskId) => void;
  deleteSelected: () => void;
};

const useFirestoreState: UseFirestoreState = () => {
  const projectId = useRecoilValue(projectIdState);
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
    (id, task) =>
      updateDoc(doc(firestore, `projects/${projectId}/tasks`, id), task),
    [projectId]
  );

  const addDependency = useCallback(
    (predecessor: TaskId, successor: TaskId) => {
      const ref = collection(firestore, `projects/${projectId}/dependencies`);
      const dependency = {
        predecessor,
        successor,
      };
      return addDoc(ref, dependency);
    },
    [projectId]
  );

  const selectedElements = useRecoilValue(selectedElementsState);

  const deleteSelected = useRecoilTransaction_UNSTABLE(
    ({ get }) =>
      () => {
        const batch = writeBatch(firestore);
        selectedElements.tasks.forEach((taskId) => {
          batch.delete(doc(firestore, `projects/${projectId}/tasks`, taskId));
          getRelatedDependencies(get, taskId).forEach((depId) =>
            batch.delete(
              doc(firestore, `projects/${projectId}/dependencies`, depId)
            )
          );
        });
        selectedElements.dependencies.forEach((depId) =>
          batch.delete(
            doc(firestore, `projects/${projectId}/dependencies`, depId)
          )
        );
        batch.commit();
      },
    [projectId, selectedElements]
  );

  return { addTask, updateTask, addDependency, deleteSelected };
};

export default useFirestoreState;
