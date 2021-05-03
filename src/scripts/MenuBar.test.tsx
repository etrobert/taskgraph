import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import noop from "lodash/noop";

import MenuBar from "./MenuBar";

describe("MenuBar", () => {
  test("calls onLoad", () => {
    const onLoad = jest.fn();
    render(
      <MenuBar onClose={noop} onLoad={onLoad} onNewGraph={noop} onSave={noop} />
    );
    userEvent.click(screen.getByText("Load"));
    expect(onLoad).toHaveBeenCalled();
  });

  test("calls onSave", () => {
    const onSave = jest.fn();
    render(
      <MenuBar onClose={noop} onLoad={noop} onNewGraph={noop} onSave={onSave} />
    );
    userEvent.click(screen.getByText("Save"));
    expect(onSave).toHaveBeenCalled();
  });

  test("calls onNewGraph", () => {
    const onNewGraph = jest.fn();
    render(
      <MenuBar
        onClose={noop}
        onLoad={noop}
        onNewGraph={onNewGraph}
        onSave={noop}
      />
    );
    userEvent.click(screen.getByText("New Graph"));
    expect(onNewGraph).toHaveBeenCalled();
  });

  test("calls onClose", () => {
    const onClose = jest.fn();
    render(
      <MenuBar
        onClose={onClose}
        onLoad={noop}
        onNewGraph={noop}
        onSave={noop}
      />
    );
    userEvent.click(screen.getByLabelText("Close Menu"));
    expect(onClose).toHaveBeenCalled();
  });
});
