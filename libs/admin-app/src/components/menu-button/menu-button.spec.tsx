import { act, fireEvent, render } from "@testing-library/react";

import { History } from "history";
import { MenuButton } from "..";
import React from "react";
import { mock as mockExtended } from "jest-mock-extended";
import { mocked } from "ts-jest/utils";
import { useHistory } from "react-router-dom";

jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");

  return {
    __esModule: true,
    ...originalModule,
    useHistory: jest.fn(),
  };
});

describe("<MenuLink>", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("adds to the history array when clicked", () => {
    const mockHistoryArray = mockExtended<History>();
    mocked(useHistory, true).mockReturnValue(mockHistoryArray);
    const { getByText } = render(
      <MenuButton groups={["anonymous"]} to="/foo-route">
        Click Me
      </MenuButton>
    );
    act(() => {
      fireEvent.click(getByText("Click Me"));
    });
    expect(mockHistoryArray.push).toHaveBeenCalledWith("/foo-route");
  });
});
