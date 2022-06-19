import styled from '@emotion/styled';
import { FC } from 'react';

const HeroBox = styled('div')(({ theme }) => {
  return {
    minHeight: '330px',
    width: '100%',
    height: '330px',
    borderBottom: '1px solid black',
    fontFamily: '"Acumin Pro Semicondensed", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#d4f9e3',
  };
});

const Hero: FC = (props) => <HeroBox>{props.children}</HeroBox>;

export default Hero;
