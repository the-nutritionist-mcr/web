import Hero from './hero';
import { shallow } from 'enzyme';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@emotion/react';

const theme = {
  colors: {
    buttonBlack: 'black',
    labelText: 'black',
  },
  menubarHeight: 100,
};

describe('The hero box', () => {
  it('renders without error', () => {
    shallow(
      <ThemeProvider theme={theme}>
        <Hero>Something</Hero>
      </ThemeProvider>
    );
  });

  it('renders it children', () => {
    render(
      <ThemeProvider theme={theme}>
        <Hero>Hello!</Hero>
      </ThemeProvider>
    );

    const hero = screen.queryByText('Hello!');

    expect(hero).toBeInTheDocument();
  });
});
