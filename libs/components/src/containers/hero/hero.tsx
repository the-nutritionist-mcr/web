import styled from '@emotion/styled';
import { ReactNode } from 'react';

const HeroBox = styled('div')(() => {
  return {
    minHeight: '130px',
    width: '100%',
    height: 'calc(170px + 88px)',
    padding: '88px 0 0 0',
    borderBottom: '1px solid black',
    fontFamily: 'acumin-pro-semi-condensed, Arial, sans-serif',
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
