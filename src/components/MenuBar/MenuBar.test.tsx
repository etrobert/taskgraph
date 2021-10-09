import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import noop from "lodash/noop";

import MenuBar from "./MenuBar";

const noopProps = {
  onClose: noop,
  onLoad: noop,
  onSave: noop,
  onNewGraph: noop,
};

describe("MenuBar", () => {
  test("calls onNewGraph", () => {
    const onNewGraph = jest.fn();
    render(<MenuBar open {...noopProps} onNewGraph={onNewGraph} />);
    userEvent.click(screen.getByText("New Graph"));
    expect(onNewGraph).toHaveBeenCalled();
  });

  test("calls onClose", () => {
    const onClose = jest.fn();
    render(<MenuBar open {...noopProps} onClose={onClose} />);
    userEvent.click(screen.getByLabelText("Close Menu"));
    expect(onClose).toHaveBeenCalled();
  });
});
