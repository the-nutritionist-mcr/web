import { Grommet } from 'grommet';
import { FC } from 'react';
import styled from '@emotion/styled';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14pt',
      height: '20px',
    },
  },
};

const Padding = styled.div`
  padding: 0 1rem;
`;

export const AdminTemplate: FC = (props) => (
  <Grommet theme={theme}>
    <Padding>{props.children}</Padding>
  </Grommet>
);

export default AdminTemplate;
