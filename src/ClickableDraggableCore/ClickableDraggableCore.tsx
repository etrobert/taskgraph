import React, { ReactNode, useState } from "react";
import {
  DraggableCore,
  DraggableCoreProps,
  DraggableEventHandler,
} from "react-draggable";

import { Point, squaredDistance } from "@/geometry";

type Props = Partial<DraggableCoreProps> & {
  children: ReactNode;
  threshold?: number;
  onClick: DraggableEventHandler;
};

/**
 * Extension of DraggableCore from react-draggable.
 * Will call onClick if the pointer barely moved between onStart and onStop.
 *
 * @param threshold The maximum travel distance to still be considered a click.
 * Defaults to `5`.
 */
const ClickableDraggableCore = ({
  children,
  onStart,
  onStop,
  onClick,
  threshold = 5,
  ...props
}: Props): JSX.Element => {
  const [dragOrigin, setDragOrigin] = useState<Point>({ x: 0, y: 0 });

  return (
    <DraggableCore
      onStart={(event, data) => {
        setDragOrigin(data);
        onStart?.(event, data);
      }}
      onStop={(event, data) => {
        // If it has not moved a lot since the beginning of the drag
        // We consider it as a click
        if (squaredDistance(dragOrigin, data) <= threshold * threshold)
          onClick(event, data);
        onStop?.(event, data);
      }}
      {...props}
    >
      {children}
    </DraggableCore>
  );
};

export default ClickableDraggableCore;
