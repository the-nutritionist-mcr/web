import styled from '@emotion/styled';
import { Button, Hero, Input, ParagraphText } from '@tnmw/components';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { HTTP } from '../infrastructure/constants';
import { swrFetcher } from '../utils/swr-fetcher';
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
  padding: 0 1em;
  align-items: center;
  flex-direction: column;
`;

const resetPassword = async (payload: { username: string }): Promise<void> => {
  await swrFetcher(
    'customer/reset-password',
    {
      method: HTTP.verbs.Post,
      body: JSON.stringify({ ...payload, generateNew: true }),
    },
    false
  );
  toast.success(
    'Your password was successfully reset. Please check your email'
  );
};

const ForgotMyPassword = () => {
  const [email, setEmail] = useState('');

  return (
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
          <Input
            name="email"
            label="Email Address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </form>
        <div className={actions}>
          <Button
            size="large"
            primary
            onClick={async (event) => {
              await resetPassword({ username: email });
              event.preventDefault();
            }}
          >
            Send new password
          </Button>
        </div>
      </PageSpacing>
    </>
  );
};

export default ForgotMyPassword;
