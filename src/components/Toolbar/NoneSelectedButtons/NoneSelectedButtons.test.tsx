import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { noop } from "lodash";
import { RecoilRoot } from "recoil";

import { drawModeState } from "@/atoms";
import RecoilObserver from "@/RecoilObserver";

import NoneSelectedButtons from "./NoneSelectedButtons";

describe("NoneSelectedButtons", () => {
  test("change draw mode when clicked", () => {
    const onChange = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={drawModeState} onChange={onChange} />
        <NoneSelectedButtons onCreateTask={noop} />
      </RecoilRoot>
    );

    userEvent.click(screen.getByLabelText("Change Draw Mode"));
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenCalledWith(false); // Initial State
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test("calls onCreateTask", () => {
    const onCreateTask = jest.fn();
    render(
      <RecoilRoot>
        <NoneSelectedButtons onCreateTask={onCreateTask} />
      </RecoilRoot>
    );
    userEvent.click(screen.getByLabelText("Create Task"));
    expect(onCreateTask).toHaveBeenCalledTimes(1);
  });
});
