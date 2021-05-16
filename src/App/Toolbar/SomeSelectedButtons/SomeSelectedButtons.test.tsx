import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash";

import SomeSelectedButtons from "./SomeSelectedButtons";

describe("SomeSelectedButtons", () => {
  test("calls onComplete", () => {
    const onComplete = jest.fn();
    render(<SomeSelectedButtons onComplete={onComplete} onDelete={noop} />);
    userEvent.click(screen.getByLabelText("Complete Selected"));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete", () => {
    const onDelete = jest.fn();
    render(<SomeSelectedButtons onComplete={noop} onDelete={onDelete} />);
    userEvent.click(screen.getByLabelText("Delete Selected"));
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
