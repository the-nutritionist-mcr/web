import { TabBox, Tab } from '../../containers';
import styled from '@emotion/styled';
import { FC } from 'react';
import LoginBox from './login-box';
import { padding, tabButtonBox } from './login-and-register-box.css';

interface LoginAndRegisterBoxProps {
  defaultTab: string;
}

const StyledP = styled.p`
  font-family: ibm-plex-serif, 'Times New Roman', serif;
  line-height: 23px;
  text-align: left;
  margin-top: 1.5rem;
`;

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
      buttonBoxClass={tabButtonBox}
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
        <div className={padding}>
          <LoginBox />
        </div>
      </Tab>
      <Tab tabTitle="Register">
        <div className={padding}>
          <StyledP>
            We are not currently accepting registrations to the portal via the
            website. For more information about our services, you can book a
            consultation via the 'Get Started' button above.
          </StyledP>
        </div>
      </Tab>
    </TabBox>
  </Box>
);

export default LoginAndRegisterBox;
