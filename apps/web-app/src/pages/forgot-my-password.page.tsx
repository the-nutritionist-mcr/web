import styled from '@emotion/styled';
import { Hero, ParagraphText } from '@tnmw/components';
import { CONTACT_EMAIL } from '@tnmw/constants';

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

const Label = styled('div')`
  margin-top: 1rem;
`;

const ForgotMyPassword = () => (
  <>
    <Hero>
      <ForgotPasswordBox>
        <Header>Forgot Your Password</Header>
      </ForgotPasswordBox>
    </Hero>
    <Label>
      <ParagraphText>
        If you have forgotten your password, please get in touch with us at{' '}
        <strong>{CONTACT_EMAIL}</strong> in order to request a reset
      </ParagraphText>
    </Label>
  </>
);

export default ForgotMyPassword;
