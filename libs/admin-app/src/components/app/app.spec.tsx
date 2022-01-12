import { NavBar, Router } from "..";
import { App } from ".";
import { Notification } from "grommet-controls";
import React from "react";
import { mocked } from "ts-jest/utils";
import { shallow } from "enzyme";
import { useApp } from "./hooks";

jest.mock("react-redux");
jest.mock("./hooks");

describe("the <App /> component", () => {
  it("renders a <NavBar />", () => {
    mocked(useApp, true).mockReturnValue({ closeError: jest.fn() });
    const wrapper = shallow(<App />);

    expect(wrapper.find(NavBar).exists()).toEqual(true);
  });

  it("renders a <Router />", () => {
    mocked(useApp, true).mockReturnValue({ closeError: jest.fn() });
    const wrapper = shallow(<App />);

    expect(wrapper.find(Router).exists()).toEqual(true);
  });

  it("displays a notification with the correct label if state contains an error", () => {
    mocked(useApp, true).mockReturnValue({
      closeError: jest.fn(),
      error: "foo-error",
    });

    const wrapper = shallow(<App />);
    const notification = wrapper.find(Notification);
    expect(notification.exists()).toEqual(true);
    expect(notification.props().state).toEqual("foo-error");
  });

  it("hides the error notification if there is no error", () => {
    mocked(useApp, true).mockReturnValue({ closeError: jest.fn() });

    const wrapper = shallow(<App />);
    const notification = wrapper.find(Notification);
    expect(notification.exists()).toEqual(false);
  });
});
