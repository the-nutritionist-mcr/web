import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { FC, ChangeEvent } from 'react';

const InputContainer = styled.div<InputProps>`
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
  display: flex;
  flex-direction: column;
  flex-grow: 999;
  width: ${(props) => (props.width ? props.width : `inherit`)};
`;

const LabelRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.2rem;
`;

const ErrorLabel = styled.label`
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
  color: red;
  padding-bottom: 0.5rem;
  font-style: italic;
`;

ErrorLabel.displayName = 'label';

const InputLabel = styled.label<InputProps>((props) => {
  const theme = useTheme() as unknown as { colors: { [key: string]: string } };
  return {
    fontFamily: 'acumin-pro, Arial, sans-serif',
    fontWeight: 'bold',
    color: props.disabled ? '#B8B8B8' : theme.colors['labelText'],
    flexGrow: 999,
    paddingBottom: '0.5rem',
  };
});

InputLabel.displayName = 'label';

export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  type?: string;
  error?: boolean;
  disabled?: boolean;
  width?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const InputField = styled.input<InputProps>((props) => {
  const theme = useTheme() as unknown as { colors: { [key: string]: string } };

  const width = props.width
    ? {
        width: props.width,
      }
    : {};

  const borderColor = props.disabled ? '#B8B8B8' : theme.colors['buttonBlack'];

  return {
    fontFamily: 'acumin-pro, Arial, sans-serif',
    margin: 0,
    borderRadius: 0,
    border: `1px solid ${props.error ? 'red' : borderColor}`,
    backgroundColor: props.disabled ? '#fafafa' : 'white',
    lineHeight: `1.5rem`,
    padding: `0.5rem 0.5rem`,
    ...width,
  };
});
InputField.displayName = 'input';

const Input: FC<InputProps> = (props) => (
  <InputContainer {...props}>
    <LabelRow>
      <InputLabel disabled={props.disabled} htmlFor={props.name}>
        {props.label}
      </InputLabel>
    </LabelRow>
    <InputField
      disabled={props.disabled}
      id={props.name}
      name={props.name}
      value={props.value}
      error={props.error}
      type={props.type}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  </InputContainer>
);

export default Input;
