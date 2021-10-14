import {doc, setDoc} from "../_snowpack/pkg/firebase/firestore.js";
import firestore from "./firestore.js";
const createNewWorkspace = async (userId) => {
  const ref = doc(firestore, `workspaces/${userId}`);
  const newWorkspace = {};
  return setDoc(ref, newWorkspace);
};
export default createNewWorkspace;
