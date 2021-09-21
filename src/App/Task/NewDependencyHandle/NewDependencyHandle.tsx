import React, { useCallback } from "react";
import { DraggableCore } from "react-draggable";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import useGraphState from "@/App/useGraphState";
import { hoveredTaskState, newDependencyState, TaskId } from "@/atoms";

import "./NewDependencyHandle.css";

type Props = {
  taskId: TaskId;
  dragOffsetParent?: HTMLElement;
  zoom: number;
};

const useOnDragStop = () => {
  const [newDependency, setNewDependency] = useRecoilState(newDependencyState);
  const hoveredTask = useRecoilValue(hoveredTaskState);
  const { addDependency } = useGraphState();

  return useCallback(() => {
    // Reset the newDependency state
    setNewDependency(null);

    if (hoveredTask === null || newDependency === null) return;

    const { predecessor } = newDependency;

    addDependency({ predecessor, successor: hoveredTask });
  }, [addDependency, hoveredTask, newDependency, setNewDependency]);
};

const NewDependencyHandle = ({
  taskId,
  dragOffsetParent,
  zoom,
}: Props): JSX.Element => {
  const setNewDependency = useSetRecoilState(newDependencyState);

  const onDragStop = useOnDragStop();

  return (
    <DraggableCore
      onStart={(_, data) =>
        setNewDependency({ predecessor: taskId, cursor: data })
      }
      onDrag={(event, data) => {
        event.preventDefault();
        setNewDependency({ predecessor: taskId, cursor: data });
      }}
      onStop={onDragStop}
      offsetParent={dragOffsetParent}
      scale={zoom}
    >
      <div className={"NewDependencyHandle"} />
    </DraggableCore>
  );
};

export default NewDependencyHandle;
