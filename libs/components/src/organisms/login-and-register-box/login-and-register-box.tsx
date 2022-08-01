import { TabBox, Tab } from '../../containers';
import styled from '@emotion/styled';
import { FC } from 'react';
import LoginBox from './login-box';
const Padding = styled.div`
  padding: 1.5rem 5rem 3rem 5rem;
`;

interface LoginAndRegisterBoxProps {
  defaultTab: string;
}

const Box = styled.div`
  width: clamp(200px, 100vw, 500px);
  border-top: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  margin-top: -1px;
`;

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
          We are not currently accepting registrations via the website.
        </Padding>
      </Tab>
    </TabBox>
  </Box>
);

export default LoginAndRegisterBox;
