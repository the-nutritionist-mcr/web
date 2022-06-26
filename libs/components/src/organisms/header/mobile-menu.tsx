import styled from '@emotion/styled';

import closeButton from './TNM_Icon__Exit_9bd47247.svg';

const MobileMenuContainer = styled.div`
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #f3b762;
  position: fixed;
  padding: 30px;
  z-index: 10000;
  width: 100vw;
  height: 100vh;
`;

const StyledIcon = styled.img`
  width: 40px;
  height: 40px;
`;

const CloseButton = styled.button`
  border: 0;
  background: 0;
  top: 30px;
  right: 30px;
  position: absolute;
`;

const MobileMenuUl = styled.ul`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const MobileMenuLi = styled.li`
  border-bottom: 1px solid black;

  &:last-child {
    border-bottom: 0;
  }
`;

const MobileMenuA = styled.a`
  font-size: 37px;
  padding: 15px 0;
  width: 100%;
  display: block;
  font-family: 'Acumin Pro Semicondensed';
  text-decoration: none;
  color: black;
`;

interface MobileMenu {
  show: boolean;
  onClose: () => void;
}

export const MobileMenu = (props: MobileMenu) =>
  props.show ? (
    <MobileMenuContainer>
      <MobileMenuUl>
        <CloseButton onClick={props.onClose}>
          <StyledIcon src={closeButton} />
        </CloseButton>
        <MobileMenuLi>
          <MobileMenuA href="/">Home</MobileMenuA>
        </MobileMenuLi>

        <MobileMenuLi>
          <MobileMenuA href="/">Our Story</MobileMenuA>
        </MobileMenuLi>

        <MobileMenuLi>
          <MobileMenuA href="/">Why Choose Us</MobileMenuA>
        </MobileMenuLi>
        <MobileMenuLi>
          <MobileMenuA href="/">The Plans</MobileMenuA>
        </MobileMenuLi>
        <MobileMenuLi>
          <MobileMenuA href="/">Get Started</MobileMenuA>
        </MobileMenuLi>
      </MobileMenuUl>
    </MobileMenuContainer>
  ) : null;