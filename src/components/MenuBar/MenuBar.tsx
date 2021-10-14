import React from "react";
import { useRecoilValue } from "recoil";

import { signedInUserIdState } from "@/atoms";

import "./MenuBar.css";
import { getAuth } from "@firebase/auth";

type Props = {
  open: boolean;
  onClose: () => void;
  onNewGraph: () => void;
};

const MenuBar = ({ open, onClose, onNewGraph }: Props): JSX.Element => {
  const signedInUserId = useRecoilValue(signedInUserIdState);

  return (
    <div className={`MenuBar ${open ? "MenuBar--open" : ""}`}>
      <h1 className="MenuBar__title">TaskGraph</h1>
      <button
        aria-label="Close Menu"
        className="MenuBar__close-button iconButton"
        onClick={onClose}
      />
      <div className={"MenuBar__auth"}>
        Signed in as {signedInUserId}
        <button onClick={() => getAuth().signOut()}>Sign Out</button>
      </div>
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
