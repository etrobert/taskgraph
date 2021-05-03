import { render, screen } from "@testing-library/react";
import React from "react";
import noop from "lodash/noop";

import MenuBar from "./MenuBar";

describe("MenuBar", () => {
  test("calls onLoad", () => {
    const onLoad = jest.fn();
    render(
      <MenuBar onClose={noop} onLoad={onLoad} onNewGraph={noop} onSave={noop} />
    );
    screen.getByText("Load").click();
    expect(onLoad).toHaveBeenCalled();
  });

  test("calls onSave", () => {
    const onSave = jest.fn();
    render(
      <MenuBar onClose={noop} onLoad={noop} onNewGraph={noop} onSave={onSave} />
    );
    screen.getByText("Save").click();
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
    screen.getByText("New Graph").click();
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
    screen.getByLabelText("Close Menu").click();
    expect(onClose).toHaveBeenCalled();
  });
});
