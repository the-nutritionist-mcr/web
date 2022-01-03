import DesktopHeader from './desktop-header';
import { shallow } from 'enzyme';

describe('The desktop header', () => {
  it('renders without an error', () => {
    shallow(<DesktopHeader />);
  });

  it('contains an Our Story link', () => {
    const wrapper = shallow(<DesktopHeader />);

    const ourStoryLink = wrapper
      .find('a')
      .findWhere((link) => link.prop('href') === '/our-story/');

    expect(ourStoryLink).toHaveLength(1);
  });
});
