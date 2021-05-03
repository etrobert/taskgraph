import React, { ChangeEventHandler, ForwardedRef } from "react";
import { Graph } from "./graph";

type Props = {
  onLoad: (graph: Graph) => void;
};

const FileInput = (
  { onLoad }: Props,
  ref: ForwardedRef<HTMLInputElement>
): JSX.Element => {
  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== "application/json") return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result as string;
      const graph = JSON.parse(result) as Graph;
      onLoad(graph);
    });
    reader.readAsText(file);
  };

  return (
    <input
      accept="text/json"
      style={{ display: "none" }}
      onChange={onChange}
      ref={ref}
      type="file"
    />
  );
};
export default React.forwardRef(FileInput);
