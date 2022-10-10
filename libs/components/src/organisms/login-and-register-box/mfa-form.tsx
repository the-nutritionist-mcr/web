import { ErrorResponse } from './types/error-response';
import { MfaFormData } from './types/srp-data';
import styled from '@emotion/styled';
import { FC } from 'react';
import { Input } from '../../atoms';
import { ChallengeForm } from '../../containers';

export interface MfaFormProps {
  onSubmit: (data: MfaFormData) => void;
  errors?: ErrorResponse[];
}

const StyledP = styled.p`
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
`;

const MfaForm: FC<MfaFormProps> = (props) => (
  <ChallengeForm onSubmit={props.onSubmit}>
    <StyledP>
      A code has been sent to your phone. Please enter it in the box below.
    </StyledP>
    <Input label="Code" name="code" />
  </ChallengeForm>
);

export default MfaForm;
