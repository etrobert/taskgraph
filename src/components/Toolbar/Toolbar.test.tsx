import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RecoilRoot } from "recoil";

import RecoilObserver from "@/RecoilObserver";
import { insertModeState } from "@/atoms";

import Toolbar from "./Toolbar";

describe("Toolbar", () => {
  it("updates insertModeState", () => {
    const onInsertModeChange = jest.fn();
    render(
      <RecoilRoot>
        <RecoilObserver node={insertModeState} onChange={onInsertModeChange} />
        <Toolbar />
      </RecoilRoot>
    );
    userEvent.click(screen.getByLabelText("Create Task"));
    expect(onInsertModeChange).toHaveBeenCalledTimes(2);
    expect(onInsertModeChange).toHaveBeenCalledWith(false); // Initial State
    expect(onInsertModeChange).toHaveBeenCalledWith(true);
  });
});
