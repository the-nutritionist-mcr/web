import styled from '@emotion/styled';

const BoxContainer = styled.div`
  width: 500px;
  border: 1px solid black;
  margin-top: -1px;
`;

interface BoxProps {
  children: React.ReactNode;
}

const Box = (props: BoxProps) => {
  return <BoxContainer>{props.children}</BoxContainer>;
};

export default Box;
