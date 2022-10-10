import { ErrorResponse } from './types/error-response';
import { MfaFormData } from './types/srp-data';
import styled from '@emotion/styled';
import { FC } from 'react';
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';

export interface ConfirmMobileFormProps {
  onSubmit: (data: MfaFormData) => void;
  errors?: ErrorResponse[];
}

const StyledP = styled.p`
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
`;

const ConfirmMobileForm: FC<ConfirmMobileFormProps> = (props) => (
  <ChallengeForm onSubmit={props.onSubmit}>
    <StyledP>
      Signup was successful. To verify your phone number, please enter the code
      that was sent to your phone in the box below:
    </StyledP>
    <Input label="Code" name="code" />
  </ChallengeForm>
);

export default ConfirmMobileForm;
