import { Grommet } from 'grommet';
import { ReactNode } from 'react';
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
  padding: calc(1rem + 108px) 1rem;
  width: 100%;
`;

interface AdminTemplateProps {
  children: ReactNode;
}

export const AdminTemplate = (props: AdminTemplateProps) => {
  // useEffect(() => {
  //   prefetch(['customers', 'recipe', 'customisation', 'plan']);
  // }, []);
  return (
    <Grommet theme={theme}>
      <Padding>{props.children}</Padding>
    </Grommet>
  );
};

export default AdminTemplate;
