import { shallow } from 'enzyme';
import Button from './button';
import { ThemeProvider } from '@emotion/react';
import renderer from 'react-test-renderer';

describe('The button component', () => {
  it('should render its children', () => {
    const wrapper = shallow(<Button>Children</Button>);

    expect(wrapper.text()).toInclude('Children');
  });

  const theme = {
    colors: {
      buttonBlack: 'black',
      labelText: 'black',
    },
    menubarHeight: 100,
  };

  describe('if no primary color is passed in', () => {
    it('should be black with a black border and white text if set to primary', () => {
      const button = renderer
        .create(
          <ThemeProvider theme={theme}>
            <Button primary>something</Button>
          </ThemeProvider>
        )
        .toJSON();

      expect(button).toHaveStyleRule('background', 'black');
      expect(button).toHaveStyleRule('color', 'white');
      expect(button).toHaveStyleRule('border', `1px solid black`);
    });

    it('should have a white background with no border and black text if not set to primary', () => {
      const button = renderer
        .create(
          <ThemeProvider theme={theme}>
            <Button>something</Button>
          </ThemeProvider>
        )
        .toJSON();

      expect(button).toHaveStyleRule('background', 'white');
      expect(button).toHaveStyleRule('color', 'black');
      expect(button).toHaveStyleRule('border', `0`);
      expect(button).toHaveStyleRule('text-decoration', 'underline');
    });
  });

  // describe('if a color is passed in', () => {
  //   it('should have a white background with no border and black text if not set to primary', () => {
  //     const button = renderer
  //       .create(
  //         <ThemeProvider theme={theme}>
  //           <Button color="#FF0000" />
  //         </ThemeProvider>
  //       )
  //       .toJSON();

  //     expect(button).toHaveStyleRule('background', 'white');
  //     expect(button).toHaveStyleRule('border', `0`);
  //     expect(button).toHaveStyleRule('text-decoration', 'underline');
  //   });
  // });
});
