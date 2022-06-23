import styled from '@emotion/styled';

const Container = styled.section`
  padding-top: 3rem;
`;

interface PageSpacingProps {
  children: JSX.Element;
}

export const PageSpacing = (props: PageSpacingProps) => (
  <Container>{props.children}</Container>
);
