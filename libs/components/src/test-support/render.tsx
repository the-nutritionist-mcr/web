import { ThemeProvider, Theme } from '@emotion/react';
import { render, RenderOptions } from '@testing-library/react';
import { FC, ReactElement } from 'react';

const ProviderWrapper: FC = ({ children }) => {
  const theme: Theme = {
    colors: {
      buttonBlack: 'black',
      labelText: 'black',
    },
    menubarHeight: 100,
    breakpoints: {
      small: {
        end: 400,
      },
      medium: {
        start: 401,
        end: 900,
      },
      large: {
        start: 601,
      },
    },
  };

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'queries'>
) => {
  return render(ui, { wrapper: ProviderWrapper, ...options });
};

export * from '@testing-library/react';
export { customRender as render };
