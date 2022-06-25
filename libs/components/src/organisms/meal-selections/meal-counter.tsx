import { ParagraphText } from '../../atoms';
import { QuantityStepper } from '../../molecules';
import styled from '@emotion/styled';
import { uniqueId } from 'lodash';
import { FC } from 'react';
import { divider, header, nutritionAndAllergyLink } from './meal-counter.css';

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
  return (
    <Container aria-labelledby={headerId}>
      <h3 className={header} id={headerId}>
        {props.title.toLocaleLowerCase()}
      </h3>
      <ParagraphText>
        {props.description}
        <hr className={divider} />
      </ParagraphText>
      <p className={nutritionAndAllergyLink}>Allergen Info</p>
      <QuantityStepper
        onChange={props.onChange}
        value={props.value ?? 0}
        min={props.min ?? 0}
        max={props.max ?? 0}
      />
    </Container>
  );
};

export default MealCounter;
