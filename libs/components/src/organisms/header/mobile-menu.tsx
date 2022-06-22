import styled from '@emotion/styled';

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
}

export const MobileMenu = (props: MobileMenu) =>
  props.show ? (
    <MobileMenuContainer>
      <MobileMenuUl>
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
