import styled from '@emotion/styled';
import { FC } from 'react';

import tnmFullWhite from './TNM-Full-white.svg';
import SeasonalPattern from './Seasonal-pattern-spring-tnm.png';
import nStamp from './tnm-sticker-dark-grey-mint.svg';
import { TNM_SITE } from '../header/tnm-site';

const StyledFooter = styled.footer`
  width: 100%;
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
  box-sizing: border-box;
  position: relative;
  background: #253a3d;
  @media (display-mode: standalone) {
    display: none;
  }
`;

const FooterStrip = styled.div`
  background: url(${SeasonalPattern});
  background-size: cover;
  background-position: 50%;
  height: 125px;
  border-top: 1px solid black;
  border-bottom: 1px solid black;
`;

const FooterContent = styled.div`
  padding: 100px 30px;
  background: #253a3d;
  color: white;
`;

const FooterColumns = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const FooterHeaders = styled.h2`
  margin: 0;
  padding: 0;
  color: #177f7a;
  font-size: 45px;
  line-height: 49px;
  font-weight: 700;
`;
const FooterLink = styled.a`
  color: #cafbe2;
  font-size: 27px;
  line-height: 33px;
  font-family: acumin-pro-semi-condensed, sans-serif;
  text-decoration: none;
`;

const FooterLi = styled.li`
  margin: 20px 0;
  padding: 0;
`;

const UnStyledUl = styled.ul`
  list-style: none;
  padding: 0;
`;

const TnmLogoWhiteAnchor = styled.a`
  max-width: 422px;
  height: auto;
  width: 100%;
  display: block;
  margin-bottom: 100px;

  & img {
    width: 100%;
  }
`;

const Stamp = styled.div`
  width: 150px;
  height: 150px;
  top: 50px;
  right: 20px;
  position: absolute;
  transform: rotate(16deg);
  background: url(${nStamp});
`;

const StampContainer = styled.div`
  max-width: 1400px;
  position: relative;
  margin: 0 auto;
`;

const Footer: FC = () => (
  <StyledFooter>
    <StampContainer>
      <Stamp />
    </StampContainer>
    <FooterStrip aria-hidden></FooterStrip>
    <FooterContent>
      <TnmLogoWhiteAnchor href={TNM_SITE}>
        <img src={tnmFullWhite} alt="The Nutriontist MCR" />
      </TnmLogoWhiteAnchor>
      <FooterColumns>
        <div>
          <FooterHeaders>Order</FooterHeaders>
          <UnStyledUl>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/the-plans/#UnStyledUltra-Micro`}>
                Ultra Micro
              </FooterLink>
            </FooterLi>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/the-plans/#Micro`}>
                Micro
              </FooterLink>
            </FooterLi>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/the-plans/#Equilibrium`}>
                Equilibrium
              </FooterLink>
            </FooterLi>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/the-plans/#Mass`}>Mass</FooterLink>
            </FooterLi>
          </UnStyledUl>
        </div>

        <div>
          <FooterHeaders>About</FooterHeaders>
          <UnStyledUl>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/our-story`}>Our Story</FooterLink>
            </FooterLi>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/why-choose-us`}>
                Why Choose Us?
              </FooterLink>
            </FooterLi>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/the-plans`}>Meal Plans</FooterLink>
            </FooterLi>
          </UnStyledUl>
        </div>

        <div>
          <FooterHeaders>Contact</FooterHeaders>
          <UnStyledUl>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/faq`}>FAQ</FooterLink>
            </FooterLi>
            <FooterLi>
              <FooterLink href={`${TNM_SITE}/get-started`}>
                Get Started
              </FooterLink>
            </FooterLi>
          </UnStyledUl>
        </div>
      </FooterColumns>
    </FooterContent>
  </StyledFooter>
);

export default Footer;
