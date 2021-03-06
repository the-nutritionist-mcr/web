import styled from '@emotion/styled';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ComponentsProps {}

const StyledComponents = styled.div`
  color: pink;
`;

export function Components(props: ComponentsProps) {
  return (
    <StyledComponents>
      <h1>Welcome to Components!</h1>
    </StyledComponents>
  );
}

export default Components;
