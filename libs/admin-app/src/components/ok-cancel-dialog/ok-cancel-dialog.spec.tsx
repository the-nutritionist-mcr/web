import { Button, Form, FormField, TextInput } from "grommet";
import { mount, shallow } from "enzyme";
import { OkCancelDialog } from ".";
import React from "react";
import { act } from "react-dom/test-utils";

jest.mock("react-redux");

describe("The OkCancelDialog", () => {
  it("Is visible if show is true", () => {
    const wrapper = shallow(
      <OkCancelDialog
        show={true}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(wrapper.type()).not.toEqual(null);
  });

  it("Is a null component if show is false", () => {
    const wrapper = shallow(
      <OkCancelDialog
        show={false}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(wrapper.type()).toEqual(null);
  });

  it("Renders everything inside a form of the 'thing' prop is present", () => {
    const wrapper = mount(
      <OkCancelDialog
        thing={{}}
        show={true}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(wrapper.find(Form).exists()).toEqual(true);
  });

  it("Does not use a form if 'thing' prop is not present", () => {
    const wrapper = shallow(
      <OkCancelDialog
        show={true}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(wrapper.find(Form).exists()).not.toEqual(true);
  });

  it("Renders children", () => {
    const wrapper = shallow(
      <OkCancelDialog
        show={true}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      >
        <div className="childDiv" />
      </OkCancelDialog>
    );

    expect(wrapper.find(".childDiv").exists()).toEqual(true);
  });

  it("Controls the value of any form fields", () => {
    const wrapper = mount(
      <OkCancelDialog
        show={true}
        thing={{ fooField: "fooValue" }}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      >
        <FormField name="fooField">
          <TextInput name="fooField" />
        </FormField>
      </OkCancelDialog>
    );

    expect(wrapper.find("input").props().value).toEqual("fooValue");
  });

  it("Does not displays a reset button if there is no 'thing' prop", () => {
    const wrapper = shallow(
      <OkCancelDialog
        show={true}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(
      wrapper
        .find(Button)
        .findWhere((button) => button.props().type === "reset")
        .exists()
    ).toEqual(false);
  });

  it("Clicking the cancel button fires the onCancel handler", () => {
    const onCancel = jest.fn();

    const wrapper = mount(
      <OkCancelDialog
        show={true}
        thing={{}}
        header="Foo"
        onOk={jest.fn()}
        onCancel={onCancel}
      />
    );

    act(() => {
      wrapper
        .find(Button)
        .findWhere((button) => button.props().label === "Cancel")
        .simulate("click");
    });

    expect(onCancel).toHaveBeenCalled();
  });

  it("Clicking the ok button does not submit the onOk handler if there is a thing and there is form validation errors", () => {
    const onOk = jest.fn();

    const wrapper = mount(
      <OkCancelDialog
        show={true}
        header="Foo"
        onOk={onOk}
        onCancel={jest.fn()}
        thing={{ fooField: "value" }}
      >
        <FormField name="fooField">
          <TextInput name="fooField" required />
        </FormField>
      </OkCancelDialog>
    );

    act(() => {
      wrapper.find("input").simulate("change", { target: { value: "" } });
    });

    wrapper.update();

    act(() => {
      wrapper
        .find(Button)
        .findWhere((button) => button.props().label === "Ok")
        .simulate("click");
    });

    expect(onOk).not.toHaveBeenCalled();
  });

  it.skip("Resetting form resets field values to original values", () => {
    const wrapper = mount(
      <OkCancelDialog
        show={true}
        thing={{ fooField: "fooValue" }}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      >
        <FormField name="fooField">
          <TextInput name="fooField" />
        </FormField>
      </OkCancelDialog>
    );

    act(() => {
      wrapper.find("input").simulate("change", { target: { value: "hello" } });
    });

    wrapper.update();

    wrapper.find("button[type='reset']").simulate("click");

    wrapper.update();

    expect(wrapper.find("input").props().value).toEqual("fooValue");
  });

  it("Allows you to edit the controlled input fields", () => {
    const wrapper = mount(
      <OkCancelDialog
        show={true}
        thing={{ fooField: "fooValue" }}
        header="Foo"
        onOk={jest.fn()}
        onCancel={jest.fn()}
      >
        <FormField name="fooField">
          <TextInput name="fooField" />
        </FormField>
      </OkCancelDialog>
    );

    act(() => {
      wrapper.find("input").simulate("change", { target: { value: "hello" } });
    });

    wrapper.update();

    expect(wrapper.find("input").props().value).toEqual("hello");
  });
});
