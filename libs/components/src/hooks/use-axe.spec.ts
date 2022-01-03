import axe from '@axe-core/react';
import { renderHook } from '@testing-library/react-hooks';
import React from 'react';
import ReactDom from 'react-dom';
import { mocked } from 'ts-jest/utils';
import { useAxe } from './use-axe';

jest.mock('react-dom');
jest.mock('@axe-core/react');

describe('use axe', () => {
  afterEach(() => {
    delete process.env['NODE_ENV'];
    jest.resetAllMocks();
  });

  it('should pass react and reactdom into the axe function', async () => {
    const { waitFor } = renderHook(() => useAxe());

    await waitFor(() =>
      expect(mocked(axe, true)).toBeCalledWith(React, ReactDom, 1000)
    );
  });

  it('should not do anything in production', async () => {
    process.env['NODE_ENV'] = 'production';
    renderHook(() => useAxe());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    expect(mocked(axe, true)).not.toBeCalled();
  });
});
