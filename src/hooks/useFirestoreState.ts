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
import { selectedElementsState, workspaceIdState } from "@/atoms";
import getRelatedDependencies from "@/getRelatedDependencies";

import type { DocumentReference, UpdateData } from "firebase/firestore";
import type { Task, TaskId } from "@/types";

type UseFirestoreState = () => {
  addTask: (name: string) => void;
  updateTask: (id: TaskId, task: UpdateData<Task>) => void;
  addDependency: (predecessor: TaskId, successor: TaskId) => void;
  deleteSelected: () => void;
};

const useFirestoreState: UseFirestoreState = () => {
  const workspaceId = useRecoilValue(workspaceIdState);
  const addTask = useCallback(
    (name: string) => {
      const ref = collection(firestore, `workspaces/${workspaceId}/tasks`);
      const task = {
        name,
        position: { x: 0, y: 0 },
        status: "ready",
      };
      return addDoc(ref, task);
    },
    [workspaceId]
  );

  const updateTask = useCallback(
    (id, task) => {
      const ref = doc(
        firestore,
        `workspaces/${workspaceId}/tasks`,
        id
      ) as DocumentReference<Task>;
      updateDoc<Task>(ref, task);
    },
    [workspaceId]
  );

  const addDependency = useCallback(
    (predecessor: TaskId, successor: TaskId) => {
      const ref = collection(
        firestore,
        `workspaces/${workspaceId}/dependencies`
      );
      const dependency = {
        predecessor,
        successor,
      };
      return addDoc(ref, dependency);
    },
    [workspaceId]
  );

  const selectedElements = useRecoilValue(selectedElementsState);

  const deleteSelected = useRecoilTransaction_UNSTABLE(
    ({ get }) =>
      () => {
        const batch = writeBatch(firestore);
        selectedElements.tasks.forEach((taskId) => {
          batch.delete(
            doc(firestore, `workspaces/${workspaceId}/tasks`, taskId)
          );
          getRelatedDependencies(get, taskId).forEach((depId) =>
            batch.delete(
              doc(firestore, `workspaces/${workspaceId}/dependencies`, depId)
            )
          );
        });
        selectedElements.dependencies.forEach((depId) =>
          batch.delete(
            doc(firestore, `workspaces/${workspaceId}/dependencies`, depId)
          )
        );
        batch.commit();
      },
    [workspaceId, selectedElements]
  );

  return { addTask, updateTask, addDependency, deleteSelected };
};

export default useFirestoreState;
