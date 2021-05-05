import React from "../snowpack/pkg/react.js";
const GraphInput = ({onLoad}, ref) => {
  const onChange = (event) => {
    const files = event.target.files;
    if (!files || files.length === 0)
      return;
    const file = files[0];
    if (file.type !== "application/json")
      return;
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const result = reader.result;
      const graph = JSON.parse(result);
      onLoad(graph);
    });
    reader.readAsText(file);
  };
  return /* @__PURE__ */ React.createElement("input", {
    accept: "text/json",
    style: {display: "none"},
    onChange,
    ref,
    type: "file"
  });
};
export default React.forwardRef(GraphInput);
