import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';
import { ErrorResponse } from './types/error-response';
import { LoginFormData } from './types/srp-data';
import styled from '@emotion/styled';
import { FC } from 'react';

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
  errors?: ErrorResponse[];
}

const StyledLink = styled.a((props) => {
  return `
  font-family: "Acumin Pro", Arial, sans-serif;
  color: ${props.theme.colors.buttonBlack};
  text-decoration: 0;
`;
});

const LoginForm: FC<LoginFormProps> = (props) => (
  <ChallengeForm
    submitText="Login"
    onSubmit={props.onSubmit}
    errors={props.errors}
  >
    <Input label="Email" placeholder="a@b.com" name="email" type="email" />
    <Input label="Password" name="password" type="password" />
    <StyledLink href="/forgot-my-password">Forgot your password?</StyledLink>
  </ChallengeForm>
);
export default LoginForm;
