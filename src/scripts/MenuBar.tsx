import React from "react";

import "./MenuBar.css";

type Props = {
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNewGraph: () => void;
};

const MenuBar = ({
  onClose,
  onLoad,
  onSave,
  onNewGraph,
}: Props): JSX.Element => {
  return (
    <div id="menubar" className="MenuBar">
      <h1 className="MenuBar__title">TaskGraph</h1>
      <button
        aria-label="Close Menu"
        className="MenuBar__close-button iconButton"
        onClick={onClose}
      />
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
        aria-label="Github Repository"
        className="MenuBar__github-link"
        href="https://github.com/etrobert/taskgraph"
        rel="noreferrer noopener"
        target="_blank"
      />
      <p>
        Made by
        <a
          href="mailto:etiennerobert33@gmail.com"
          target="_blank"
          rel="noreferrer"
        >
          Etienne Robert
        </a>
      </p>
    </div>
  );
};

export default MenuBar;
