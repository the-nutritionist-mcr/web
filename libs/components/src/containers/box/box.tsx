import styled from '@emotion/styled';
import { FC } from 'react';

const BoxContainer = styled.div`
  width: 500px;
  border: 1px solid black;
  margin-top: -1px;
`;

const Box: FC = (props) => {
  return <BoxContainer>{props.children}</BoxContainer>;
};

export default Box;
