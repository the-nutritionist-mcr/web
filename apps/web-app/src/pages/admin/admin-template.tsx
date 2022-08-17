import { Grommet } from 'grommet';
import { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Loading } from '@tnmw/components';

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
  padding: 1rem 1rem;
`;

interface AdminTemplateProps {
  children: ReactNode;
}

export const AdminTemplate = (props: AdminTemplateProps) => (
  <Grommet theme={theme}>
    <Padding>{props.children}</Padding>
  </Grommet>
);

export default AdminTemplate;
