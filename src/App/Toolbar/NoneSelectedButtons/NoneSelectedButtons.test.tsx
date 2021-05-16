import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash";

import NoneSelectedButtons from "./NoneSelectedButtons";

describe("NoneSelectedButtons", () => {
  test("calls onChangeLinkMode", () => {
    const onChangeLinkMode = jest.fn();
    render(
      <NoneSelectedButtons
        linkMode
        onChangeLinkMode={onChangeLinkMode}
        onCreateTask={noop}
      />
    );
    userEvent.click(screen.getByLabelText("Change Link Mode"));
    expect(onChangeLinkMode).toHaveBeenCalledTimes(1);
  });

  test("calls onCreateTask", () => {
    const onCreateTask = jest.fn();
    render(
      <NoneSelectedButtons
        linkMode
        onChangeLinkMode={noop}
        onCreateTask={onCreateTask}
      />
    );
    userEvent.click(screen.getByLabelText("Create Task"));
    expect(onCreateTask).toHaveBeenCalledTimes(1);
  });
});
