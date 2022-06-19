import styled from '@emotion/styled';

/* eslint-disable-next-line */
export interface StaticPagesProps {}

const StyledStaticPages = styled.div`
  color: pink;
`;

export function StaticPages(props: StaticPagesProps) {
  return (
    <StyledStaticPages>
      <h1>Welcome to StaticPages!</h1>
    </StyledStaticPages>
  );
}

export default StaticPages;
