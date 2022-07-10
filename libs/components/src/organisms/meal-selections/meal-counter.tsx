import { ParagraphText } from '../../atoms';
import { QuantityStepper } from '../../molecules';
import styled from '@emotion/styled';
import { uniqueId } from 'lodash';
import { FC } from 'react';
import {
  container,
  divider,
  header,
  nutritionAndAllergyLink,
} from './meal-counter.css';

export interface MealCounterProps {
  title: string;
  description: string;
  contains: string;
  value?: number;
  onChange?: (newValue: number) => void;
  max?: number;
  min?: number;
}

const Container = styled.section`
  display: grid;
  text-align: center;
  grid-template-rows: 3.5rem 6rem 2.5rem;
  max-width: 20rem;
`;

const MealCounter: FC<MealCounterProps> = (props) => {
  const headerId = uniqueId();
  const contains = props.contains ? props.contains : 'no allergens';
  return (
    <section className={container} aria-labelledby={headerId}>
      <h3 className={header} id={headerId}>
        {props.title.toLocaleLowerCase()}
      </h3>
      <ParagraphText>{props.description}</ParagraphText>
      <hr className={divider} />
      <p className={nutritionAndAllergyLink}>Contains {contains}</p>
      <QuantityStepper
        onChange={props.onChange}
        value={props.value ?? 0}
        min={props.min ?? 0}
        max={props.max ?? 0}
      />
    </section>
  );
};

export default MealCounter;
