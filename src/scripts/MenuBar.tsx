import React from "react";

import "./MenuBar.css";

type Props = {
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNewGraph: () => void;
};

const MenuBar = ({ onClose, onLoad, onSave, onNewGraph }: Props) => {
  return (
    <aside id="menubar" className="MenuBar">
      <h1>TaskGraph</h1>
      <button
        className="MenuBar__close-button iconButton"
        onClick={onClose}
      ></button>
      <ul>
        <li>
          <button onClick={onSave}>Save</button>
        </li>
        <li>
          <button onClick={onLoad}>Load</button>
        </li>
        <li>
          <button onClick={onNewGraph}>New Graph</button>
        </li>
      </ul>
      <a
        className="MenuBar__github-link"
        href="https://github.com/etrobert/taskgraph"
        rel="noreferrer noopener"
        target="_blank"
      ></a>
      <p>
        Made by
        <a href="mailto:etiennerobert33@gmail.com" target="_blank">
          Etienne Robert
        </a>
      </p>
    </aside>
  );
};

export default MenuBar;
