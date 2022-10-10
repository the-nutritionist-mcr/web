import AddIcon from './tnm-add.png';
import MinusIcon from './tnm-subtract.png';
import { IconButton } from '../../atoms';
import styled from '@emotion/styled';
import { uniqueId } from 'lodash';
import { FC, Fragment } from 'react';

export interface QuantityStepperProps {
  value?: number;
  onChange?: (newValue: number) => void;
  label?: string;
  max?: number;
  min?: number;
}

const StyledDiv = styled('div')`
  display: flex;
  gap: 0.1rem;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  border-radius: 30px;
  padding: 5px;
`;

const LabelText = styled.label`
  flex-grow: 999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: acumin-pro-semi-condensed, Arial, sans-serif;
  padding-left: 0.5rem;
`;

const QuantityStepper: FC<QuantityStepperProps> = (props) => {
  const CountLabel = styled('div')`
    font-family: acumin-pro-semi-condensed, Arial, sans-serif;
    font-weight: bold;
    flex-grow: ${props.label ? '0' : '999'};
    padding-left: ${props.label ? '0.5rem' : '0'};
    text-align: center;
  `;
  const minusDisabled =
    props.value !== undefined &&
    props.min !== undefined &&
    props.value === props.min;

  const plusDisabled =
    props.value !== undefined &&
    props.max !== undefined &&
    props.value === props.max;

  const minusButton = (
    <IconButton
      onClick={() => {
        if (!minusDisabled) {
          props.onChange?.((props.value ?? 0) - 1);
        }
      }}
      icon={MinusIcon}
      a11yLabel="Decrease"
      disabled={minusDisabled}
    />
  );

  const plusButton = (
    <IconButton
      onClick={() => {
        if (!plusDisabled) {
          props.onChange?.((props.value ?? 0) + 1);
        }
      }}
      icon={AddIcon}
      a11yLabel="Increase"
      disabled={plusDisabled}
    />
  );

  const labelId = uniqueId();

  const countLabel = (
    <CountLabel
      role="spinbutton"
      aria-valuenow={props.value ?? 0}
      aria-valuemin={props.min}
      aria-valuemax={props.max}
      aria-labelledby={labelId}
    >
      {props.value ?? 0}
    </CountLabel>
  );
  const widgets = props.label ? (
    <Fragment>
      {countLabel}
      <LabelText id={labelId}>{props.label}</LabelText>
      {minusButton}
      {plusButton}
    </Fragment>
  ) : (
    <Fragment>
      {minusButton}
      {countLabel}
      {plusButton}
    </Fragment>
  );
  return <StyledDiv>{widgets}</StyledDiv>;
};

export default QuantityStepper;
