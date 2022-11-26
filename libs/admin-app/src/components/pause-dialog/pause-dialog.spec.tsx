import moment, { Moment } from 'moment';
import Customer from '../../domain/Customer';
import MockDate from 'mockdate';
import PauseDialog from './pause-dialog';
import React from 'react';

import { act } from 'react-dom/test-utils';
import { mock } from 'jest-mock-extended';
import { mocked } from 'jest-mock';
import { mount } from 'enzyme';

jest.mock('react-redux');
jest.mock('moment');

describe('The pause dialog', () => {
  const oldDateNow = Date.now.bind(global.Date);
  beforeEach(() => {
    // 17th November 2020
    MockDate.set(1605635814000);
    const dateNowStub = jest.fn(() => 1605635814000);
    global.Date.now = dateNowStub;
  });

  afterEach(() => {
    jest.clearAllMocks();
    global.Date.now = oldDateNow;
    MockDate.reset();
  });

  it('Allows you to select dates in the future and changes the friendly text when you do', () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);

    const customer = mock<Customer>();
    customer.pauseStart = undefined;
    customer.pauseEnd = undefined;

    const wrapper = mount(
      <PauseDialog
        show={true}
        customer={customer}
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const twentySecondOfMonthButton = wrapper
      .find("[aria-label='Start Pause']")
      .findWhere((node) => node.text() === '22')
      .find('div')
      .find('button');

    act(() => {
      twentySecondOfMonthButton.prop('onClick')?.({} as React.MouseEvent);
    });

    const selectedStartDate = wrapper.find(
      "[aria-label='Selected start date']"
    );

    expect(selectedStartDate.at(0).text()).toEqual('from The Date');
  });

  it("Doesn't allow you to select dates in the past for end pause", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);

    const customer = mock<Customer>();
    customer.pauseStart = undefined;
    customer.pauseEnd = undefined;

    const wrapper = mount(
      <PauseDialog
        show={true}
        customer={customer}
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const firstOfMonthButton = wrapper
      .find("[aria-label='End Pause']")
      .findWhere((node) => node.text() === '1')
      .find('div')
      .find('button');

    expect(firstOfMonthButton.at(0).prop('disabled')).toEqual(true);
  });

  it("Doesn't allow you to select end pause dates before start pause dates", () => {
    const mockMoment = mock<Moment>();
    mockMoment.calendar.mockReturnValue('The Date');
    mocked(moment, true).mockReturnValue(mockMoment);

    const customer = mock<Customer>();
    customer.pauseStart = undefined;
    customer.pauseEnd = undefined;

    const wrapper = mount(
      <PauseDialog
        show={true}
        customer={customer}
        onOk={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    const twentyEightOfMonthStartPauseButton = wrapper
      .find("[aria-label='Start Pause']")
      .findWhere((node) => node.text() === '28')
      .find('div')
      .find('button');

    act(() => {
      twentyEightOfMonthStartPauseButton.prop('onClick')?.(
        {} as React.MouseEvent
      );
    });

    wrapper.update();

    const twentySecondOfMonthEndPauseButton = wrapper
      .find("[aria-label='End Pause']")
      .findWhere((node) => node.text() === '22')
      .find('div')
      .find('button');
    expect(twentySecondOfMonthEndPauseButton.at(0).prop('disabled')).toEqual(
      true
    );
  });
});
