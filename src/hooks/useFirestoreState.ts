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
import { signedInUserIdState, selectedElementsState } from "@/atoms";
import getRelatedDependencies from "@/getRelatedDependencies";

import type { Task, TaskId } from "@/types";

type UseFirestoreState = () => {
  addTask: (name: string) => void;
  updateTask: (id: TaskId, task: Partial<Task>) => void;
  addDependency: (predecessor: TaskId, successor: TaskId) => void;
  deleteSelected: () => void;
};

const useFirestoreState: UseFirestoreState = () => {
  const signedInUserId = useRecoilValue(signedInUserIdState);
  const addTask = useCallback(
    (name: string) => {
      const ref = collection(firestore, `projects/${signedInUserId}/tasks`);
      const task = {
        name,
        position: { x: 0, y: 0 },
        status: "ready",
      };
      return addDoc(ref, task);
    },
    [signedInUserId]
  );

  const updateTask = useCallback(
    (id, task) =>
      updateDoc(doc(firestore, `projects/${signedInUserId}/tasks`, id), task),
    [signedInUserId]
  );

  const addDependency = useCallback(
    (predecessor: TaskId, successor: TaskId) => {
      const ref = collection(
        firestore,
        `projects/${signedInUserId}/dependencies`
      );
      const dependency = {
        predecessor,
        successor,
      };
      return addDoc(ref, dependency);
    },
    [signedInUserId]
  );

  const selectedElements = useRecoilValue(selectedElementsState);

  const deleteSelected = useRecoilTransaction_UNSTABLE(
    ({ get }) =>
      () => {
        const batch = writeBatch(firestore);
        selectedElements.tasks.forEach((taskId) => {
          batch.delete(
            doc(firestore, `projects/${signedInUserId}/tasks`, taskId)
          );
          getRelatedDependencies(get, taskId).forEach((depId) =>
            batch.delete(
              doc(firestore, `projects/${signedInUserId}/dependencies`, depId)
            )
          );
        });
        selectedElements.dependencies.forEach((depId) =>
          batch.delete(
            doc(firestore, `projects/${signedInUserId}/dependencies`, depId)
          )
        );
        batch.commit();
      },
    [signedInUserId, selectedElements]
  );

  return { addTask, updateTask, addDependency, deleteSelected };
};

export default useFirestoreState;
