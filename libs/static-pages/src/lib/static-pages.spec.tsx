import { render } from '@testing-library/react';

import StaticPages from './static-pages';

describe('StaticPages', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<StaticPages />);
    expect(baseElement).toBeTruthy();
  });
});
