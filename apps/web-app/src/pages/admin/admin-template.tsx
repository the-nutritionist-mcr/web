import { Grommet } from 'grommet';
import { FC } from 'react';
import Head from 'next/head'

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
    <Head>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
    />
    </Head>
  {props.children}</Grommet>
);

export default AdminTemplate;
