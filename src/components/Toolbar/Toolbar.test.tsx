import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash";
import { RecoilRoot } from "recoil";

import Toolbar from "./Toolbar";

describe("Toolbar", () => {
  test("calls onCreateTask", () => {
    const onCreateTask = jest.fn();
    render(
      <RecoilRoot>
        <Toolbar
          onCreateTask={onCreateTask}
          onComplete={noop}
          onDelete={noop}
        />
      </RecoilRoot>
    );
    userEvent.click(screen.getByLabelText("Create Task"));
    expect(onCreateTask).toHaveBeenCalledTimes(1);
  });
});
