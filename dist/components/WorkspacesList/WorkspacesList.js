import React, {useEffect, useState} from "../../../_snowpack/pkg/react.js";
import {getDocs, collection} from "../../../_snowpack/pkg/firebase/firestore.js";
import firestore from "../../firestore.js";
import WorkspacesListItem from "./WorkspacesListItem.js";
import "./WorkspacesList.css.proxy.js";
const WorkspacesList = () => {
  useEffect(() => {
    getDocs(collection(firestore, "workspaces")).then((docs) => setWorkspacesList(docs.docs.map((doc) => doc.id)));
  }, []);
  const [workspacesList, setWorkspacesList] = useState();
  return /* @__PURE__ */ React.createElement("ul", {
    className: "WorkspacesList"
  }, workspacesList?.map((id) => /* @__PURE__ */ React.createElement("li", {
    key: id
  }, /* @__PURE__ */ React.createElement(WorkspacesListItem, {
    workspaceId: id
  }))));
};
export default WorkspacesList;
