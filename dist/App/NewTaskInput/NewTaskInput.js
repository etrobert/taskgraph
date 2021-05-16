import React, {useState} from "../../../snowpack/pkg/react.js";
import "./NewTaskInput.css.proxy.js";
const NewTask = ({onNewTask, onCancel}) => {
  const [name, setName] = useState("");
  return /* @__PURE__ */ React.createElement("form", {
    onSubmit: (event) => {
      event.preventDefault();
      if (name)
        onNewTask({name});
      else
        onCancel();
    }
  }, /* @__PURE__ */ React.createElement("input", {
    className: "NewTask",
    type: "text",
    onChange: (event) => setName(event.target.value),
    onBlur: onCancel,
    value: name,
    autoFocus: true
  }));
};
export default NewTask;
