import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { RecoilRoot } from "recoil";

import MenuBar from "./MenuBar";

describe("MenuBar", () => {
  test("calls onClose", () => {
    const onClose = jest.fn();
    render(
      <RecoilRoot>
        <MenuBar open onClose={onClose} />
      </RecoilRoot>
    );
    userEvent.click(screen.getByLabelText("Close Menu"));
    expect(onClose).toHaveBeenCalled();
  });
});
