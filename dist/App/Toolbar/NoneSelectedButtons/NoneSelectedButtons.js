import React from "../../../../snowpack/pkg/react.js";
import {useRecoilState} from "../../../../snowpack/pkg/recoil.js";
import {drawModeState} from "../../../atoms.js";
const NoneSelectedButtons = ({onCreateTask}) => {
  const [drawMode, setDrawMode] = useRecoilState(drawModeState);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Change Draw Mode",
    onClick: () => setDrawMode((current) => !current),
    className: `
        Toolbar__button
        Toolbar__button-change-draw-mode
        ${drawMode ? "Toolbar__button-change-draw-mode--active" : ""}
        iconButton
      `
  }), /* @__PURE__ */ React.createElement("button", {
    "aria-label": "Create Task",
    onClick: onCreateTask,
    className: "Toolbar__button Toolbar__button-create-task iconButton"
  }));
};
export default NoneSelectedButtons;
