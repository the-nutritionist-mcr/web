import styled from '@emotion/styled';
import { Button, Hero, Input, ParagraphText } from '@tnmw/components';
import { actions, container } from './forgot-my-password.css';

const Header = styled('h1')`
  font-size: 40px;
  display: auto;
  margin: 0.5rem 0 0 0;
`;

const ForgotPasswordBox = styled('div')`
  text-align: center;
  color: #3b7d7a;
  align-items: center;
  flex-direction: row;
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const PageSpacing = styled.section`
  display: flex;
  width: 100%;
  padding: 0 auto;
  align-items: center;
  flex-direction: column;
`;

const ForgotMyPassword = () => (
  <>
    <Hero>
      <ForgotPasswordBox>
        <Header>Forgot Your Password</Header>
      </ForgotPasswordBox>
    </Hero>

    <PageSpacing>
      <form className={container}>
        <ParagraphText>
          If you have forgotten your password, enter your email address below
          and a new password will be sent to you
        </ParagraphText>
        <Input name="email" label="Email Address" />
      </form>
      <div className={actions}>
        <Button size="large" primary>
          Send new password
        </Button>
      </div>
    </PageSpacing>
  </>
);

export default ForgotMyPassword;
