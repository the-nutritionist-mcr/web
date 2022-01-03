import { TabBox, Tab, Box } from '../../containers';
import styled from '@emotion/styled';
import { FC } from 'react';
import LoginBox from './login-box';
import RegisterBox from './register-box';
const Padding = styled.div`
  padding: 1.5rem 5rem 3rem 5rem;
`;

interface LoginAndRegisterBoxProps {
  defaultTab: string;
}

const LoginAndRegisterBox: FC<LoginAndRegisterBoxProps> = (props) => (
  <Box>
    <TabBox
      defaultTab={props.defaultTab}
      onChange={(tab) => {
        window.history.replaceState(
          // eslint-disable-next-line unicorn/no-null
          null,
          '',
          `/${tab.props.tabTitle.toLocaleLowerCase()}/`
        );
      }}
    >
      <Tab tabTitle="Login">
        <Padding>
          <LoginBox />
        </Padding>
      </Tab>
      <Tab tabTitle="Register">
        <Padding>
          <RegisterBox />
        </Padding>
      </Tab>
    </TabBox>
  </Box>
);

export default LoginAndRegisterBox;
