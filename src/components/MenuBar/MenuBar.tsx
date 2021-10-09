import React from "react";

import "./MenuBar.css";

type Props = {
  open: boolean;
  onClose: () => void;
  onNewGraph: () => void;
};

const MenuBar = ({ open, onClose, onNewGraph }: Props): JSX.Element => {
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
          <button onClick={onNewGraph}>New Graph</button>
        </li>
      </ul>
      <section>
        <h2>Keyboard Shortcuts</h2>
        <ul>
          <li>[I]: [I]nsert a new task</li>
          <li>[D]/[Delete]: [D]elete selected tasks</li>
          <li>[Ctrl+a]: Select [a]ll tasks</li>
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
          Étienne Robert
        </a>
      </p>
    </div>
  );
};

export default MenuBar;
