import { jsx as _jsx } from "@emotion/react/jsx-runtime";
import { ThemeProvider } from '@emotion/react';
import { render } from '@testing-library/react';
const ProviderWrapper = ({ children }) => {
    const theme = {
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
    return _jsx(ThemeProvider, Object.assign({ theme: theme }, { children: children }), void 0);
};
const customRender = (ui, options) => {
    return render(ui, Object.assign({ wrapper: ProviderWrapper }, options));
};
export * from '@testing-library/react';
export { customRender as render };
//# sourceMappingURL=render.js.map