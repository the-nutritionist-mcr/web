import { ErrorResponse } from './types/error-response';
import { ChangePasswordFormData } from './types/srp-data';
import styled from '@emotion/styled';
import { FC } from 'react';
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';

export interface NewPasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => void;
  errors?: ErrorResponse[];
}

const StyledP = styled.p`
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
`;

const NewPasswordForm: FC<NewPasswordFormProps> = (props) => (
  <ChallengeForm onSubmit={props.onSubmit} errors={props.errors}>
    <StyledP>
      You need to change your password. Enter a new one in the box below:
    </StyledP>
    <Input label="Password" name="password" type="password" />
  </ChallengeForm>
);

export default NewPasswordForm;
