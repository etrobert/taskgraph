"use strict";

document.addEventListener("DOMContentLoaded", (event) => {
  const newTask = document.getElementById("newTask");
  document.onkeyup = (event) => {
    if (event.key == "i") {
      newTask.style.display = "block";
      newTask.focus();
    }
  };
  newTask.onkeypress = (event) => {
    if (event.key == "Enter") {
      console.log("New task: " + newTask.value);
      newTask.style.display = "none";
      newTask.value = "";
    }
  };
});
