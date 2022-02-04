import { Grommet } from 'grommet';
import { FC } from 'react';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14pt',
      height: '20px'
    }
  }
};

export const AdminTemplate: FC = props => (
  <Grommet theme={theme}>
  {props.children}</Grommet>
);

export default AdminTemplate;
