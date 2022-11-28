import { Button, Input } from '../../atoms';
import { ErrorResponse } from '../../organisms/login-and-register-box/types/error-response';
import { addNewProps } from '../../utils';
import styled from '@emotion/styled';
import {
  Dispatch,
  SetStateAction,
  ReactElement,
  ReactNode,
  PropsWithChildren,
  ChangeEvent,
  useState,
} from 'react';

export interface ChallengeFormProps<T> {
  value?: T;
  submitText?: string;
  onSubmit?: (data: T) => void;
  errors?: ErrorResponse[];
}

const FlexForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: 'left';
`;

const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const FormError = styled.div`
  color: red;
  height: 1em;
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
`;
const StyledH2 = styled.h2`
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
  margin: 0 0 0 0;
`;
StyledH2.displayName = 'h2';

const findMessage = (
  errorMessages: ErrorResponse[],
  name: string
): ErrorResponse | undefined =>
  errorMessages?.find((message) => message.fields?.includes(name));

const addErrorMessages = (nodes: ReactNode, errorMessages: ErrorResponse[]) =>
  addNewProps<typeof Input>(nodes, ({ props: { name } }) => ({
    apply: Boolean(findMessage(errorMessages, name)),
    props: { error: true },
  }));

const addEventHandlers = <T,>(
  nodes: ReactNode,
  data: T,
  setData: Dispatch<SetStateAction<T>>
) =>
  addNewProps<typeof Input>(nodes, ({ props: { name } }) => ({
    apply: name,
    props: {
      onChange: (event: ChangeEvent<HTMLInputElement>) =>
        setData({ ...data, [name]: event.target.value }),
    },
  }));

function assertFC<P>(
  _component: React.FC<P>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
): asserts _component is React.FC<P> {}

function ChallengeForm<T>(
  props: PropsWithChildren<ChallengeFormProps<T>>
): ReactElement | null {
  const [data, setData] = useState<T | undefined>();
  const eventHandlersAdded = addEventHandlers(props.children, data, setData);
  const errorMessagesAdded = addErrorMessages(
    eventHandlersAdded,
    props.errors ?? []
  );
  const formErrors = props.errors?.filter((error) => !error.fields) ?? [];
  return (
    <FlexForm>
      <FormHeader>
        <FormError role="alert">
          {formErrors
            .map((error) =>
              error.message.endsWith('.')
                ? error.message.slice(0, -1)
                : error.message
            )
            .join(', ')}
        </FormError>
      </FormHeader>
      {errorMessagesAdded}
      <Button
        primary
        onClick={(event) => {
          if (data) {
            props.onSubmit?.(data);
          }
          event.preventDefault();
        }}
      >
        {props.submitText ?? 'Submit'}
      </Button>
    </FlexForm>
  );
}

assertFC(ChallengeForm);

export default ChallengeForm;
