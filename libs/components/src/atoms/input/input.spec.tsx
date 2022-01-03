import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { ThemeProvider } from '@emotion/react';
import Input from './input';
import userEvent from '@testing-library/user-event';

const theme = {
  colors: {
    buttonBlack: 'black',
    labelText: 'black',
  },
};

describe('The input component', () => {
  it('renders a text box', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input label="an-input" name="an-input" />
      </ThemeProvider>
    );

    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });

  it('passes the value prop through to the value prop of the component', () => {
    const onChange = jest.fn();

    render(
      <ThemeProvider theme={theme}>
        <Input
          label="foo-input"
          value="some field value"
          onChange={onChange}
          name="an-input"
        />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('foo-input')).toHaveAttribute(
      'value',
      'some field value'
    );
  });

  it('Id is set the same as the name', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input name="input-name" label="A Label" />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('A Label')).toHaveAttribute(
      'id',
      'input-name'
    );
  });

  it("passes the 'type' prop through to the underlying input field", () => {
    render(
      <ThemeProvider theme={theme}>
        <Input name="input-name" label="A Label" type="email" />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('A Label')).toHaveAttribute('type', 'email');
  });

  it("passes the 'placeholder' prop through to the underlying input field", () => {
    render(
      <ThemeProvider theme={theme}>
        <Input name="input-name" placeholder="type something" label="A Label" />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('A Label')).toHaveAttribute(
      'placeholder',
      'type something'
    );
  });

  it('renders a red outline if there is an error', () => {
    render(
      <ThemeProvider theme={theme}>
        <Input error name="input-name" label="A Label" />
      </ThemeProvider>
    );
    expect(screen.getByLabelText('A Label')).toHaveStyleRule(
      'border',
      `1px solid red`
    );
  });

  it('triggers the component onChange handler if there is a change in the element', () => {
    const onChange = jest.fn();
    render(
      <ThemeProvider theme={theme}>
        <Input label="A label" name="input-name" onChange={onChange} />
      </ThemeProvider>
    );

    const input = screen.getByText('A label');

    act(() => {
      userEvent.type(input, 'hello');
    });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: 'hello' }),
      })
    );
  });
});
