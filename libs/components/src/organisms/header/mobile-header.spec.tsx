import MobileHeader from './mobile-header';

import { shallow } from 'enzyme';

describe('the mobile header', () => {
  it('renders without an error', () => {
    shallow(<MobileHeader />);
  });
});
