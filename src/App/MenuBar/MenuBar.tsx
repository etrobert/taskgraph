import React from "react";

import "./MenuBar.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNewGraph: () => void;
};

const MenuBar = ({
  open,
  onClose,
  onLoad,
  onSave,
  onNewGraph,
}: Props): JSX.Element => {
  return (
    <div className={`MenuBar ${open ? "MenuBar--open" : ""}`}>
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
      <section>
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>[I]: [I]nsert a new task</li>
          <li>[D]/[Delete]: [D]elete selected tasks</li>
          <li>[Ctrl+a]: Select [a]ll tasks</li>
          <li>[Ctrl+s]: [S]ave to file</li>
          <li>[Ctrl+o]: Load from file</li>
        </ul>
      </section>
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
