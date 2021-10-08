import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  DraggableCore
} from "../../_snowpack/pkg/react-draggable.js";
import {squaredDistance} from "../geometry.js";
const ClickableDraggableCore = ({
  children,
  onStart,
  onStop,
  onClick,
  threshold = 5,
  ...props
}) => {
  const [dragOrigin, setDragOrigin] = useState({x: 0, y: 0});
  return /* @__PURE__ */ React.createElement(DraggableCore, {
    onStart: (event, data) => {
      setDragOrigin(data);
      onStart?.(event, data);
    },
    onStop: (event, data) => {
      if (squaredDistance(dragOrigin, data) <= threshold * threshold)
        onClick(event, data);
      onStop?.(event, data);
    },
    ...props
  }, children);
};
export default ClickableDraggableCore;
