import { TnmRoute } from ".";
import React from "react";
import { Route } from "react-router-dom";
import { shallow } from "enzyme";

describe("<TnmRoute />", () => {
  it("Displays a react router <Route> if the current user is in a group specified by the groups prop", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      groups: ["foo", "bar"],
    });

    const dataReader = jest.fn();

    const wrapper = shallow(
      <TnmRoute path="/foo" groups={["foo"]} dataReader={dataReader} />
    );

    expect(wrapper.find(Route).exists()).toEqual(true);
  });

  it("Does not display a route if the current user is NOT in a group specified by the groups prop", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      groups: ["foo"],
    });

    const dataReader = jest.fn();

    const wrapper = shallow(
      <TnmRoute path="/foo" groups={["bar"]} dataReader={dataReader} />
    );

    expect(wrapper.find(Route).exists()).toEqual(false);
  });

  it("Passes the path and exact props through to the route component", () => {
    jest.spyOn(React, "useContext").mockReturnValue({
      groups: ["foo", "bar"],
    });

    const dataReader = jest.fn();

    const wrapper = shallow(
      <TnmRoute
        exact={true}
        path="/foo"
        groups={["foo"]}
        dataReader={dataReader}
      />
    );

    expect(wrapper.find(Route).props()).toEqual(
      expect.objectContaining({
        exact: true,
        path: "/foo",
      })
    );
  });
});
