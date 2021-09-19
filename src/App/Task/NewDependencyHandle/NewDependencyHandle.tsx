import React, { RefObject } from "react";
import { DraggableCore } from "react-draggable";
import { useSetRecoilState } from "recoil";

import { newDependencyState, TaskId } from "@/atoms";

import "./NewDependencyHandle.css";

type Props = {
  taskId: TaskId;
  itemsContainerRef: RefObject<HTMLDivElement>;
  zoom: number;
};

const NewDependencyHandle = ({
  taskId,
  itemsContainerRef,
  zoom,
}: Props): JSX.Element => {
  const setNewDependency = useSetRecoilState(newDependencyState);

  return (
    <DraggableCore
      onStart={(_, data) =>
        setNewDependency({ predecessor: taskId, cursor: data })
      }
      onDrag={(event, data) => {
        event.preventDefault();
        setNewDependency({ predecessor: taskId, cursor: data });
      }}
      onStop={() => setNewDependency(null)}
      offsetParent={itemsContainerRef.current ?? undefined}
      scale={zoom}
    >
      <div className={"NewDependencyHandle"} />
    </DraggableCore>
  );
};

export default NewDependencyHandle;
