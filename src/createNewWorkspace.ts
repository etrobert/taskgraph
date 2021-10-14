import { doc, setDoc } from "firebase/firestore";
import firestore from "@/firestore";

import type { UserId } from "@/types";

const createNewWorkspace = async (userId: UserId): Promise<void> => {
  const ref = doc(firestore, `workspaces/${userId}`);
  const newWorkspace = {};
  return setDoc(ref, newWorkspace);
};

export default createNewWorkspace;
