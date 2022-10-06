import styled from '@emotion/styled';
import { FC, ReactNode } from 'react';

const HeroBox = styled('div')(({ theme }) => {
  return {
    minHeight: '330px',
    width: '100%',
    height: 'calc(330px + 88px)',
    padding: '88px 0 0 0',
    borderBottom: '1px solid black',
    fontFamily: '"Acumin Pro Semicondensed", Arial, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#d4f9e3',
  };
});

interface HeroProps {
  children: ReactNode;
}

const Hero = (props: HeroProps) => <HeroBox>{props.children}</HeroBox>;

export default Hero;
