import React from "../../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState} from "../../../_snowpack/pkg/recoil.js";
import {anyElementsSelectedState, insertModeState} from "../../atoms.js";
import useFirestoreState from "../../hooks/useFirestoreState.js";
import SomeSelectedButtons from "./SomeSelectedButtons/SomeSelectedButtons.js";
import "./Toolbar.css.proxy.js";
const Toolbar = () => {
  const anyElementsSelected = useRecoilValue(anyElementsSelectedState);
  const onComplete = () => {
  };
  const setInsertMode = useSetRecoilState(insertModeState);
  const {deleteSelected} = useFirestoreState();
  return /* @__PURE__ */ React.createElement("div", {
    className: "Toolbar"
  }, anyElementsSelected && /* @__PURE__ */ React.createElement(SomeSelectedButtons, {
    onComplete,
    onDelete: deleteSelected
  }), /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Create Task",
    onClick: () => setInsertMode(true),
    className: "Toolbar__button Toolbar__button-create-task iconButton"
  }));
};
export default Toolbar;
