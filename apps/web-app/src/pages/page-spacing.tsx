import styled from '@emotion/styled';

const Container = styled.section`
  padding-top: 3rem;
  display: flex;
  width: 100%;
  padding: 0 auto;
  align-items: center;
  flex-direction: column;
`;

interface PageSpacingProps {
  children: JSX.Element;
}

export const PageSpacing = (props: PageSpacingProps) => (
  <Container>{props.children}</Container>
);
