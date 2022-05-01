import { FC } from 'react';
import { TableRow, TableCell, Select, ThemeContext, base } from 'grommet';
import styled from 'styled-components';

const SELECT_RANGE = 50;

interface PlanRowProps {
  plan: string;
  defaultDeliveryDays: string[];
  quantities: number[];
  onChange: (plan: string, quantities: number[]) => void;
}

const selectRange = [...new Array(SELECT_RANGE)].map((_, index) => index);

const AlternatingTableRow = styled(TableRow)`
  &:nth-child(2n) {
    background-color: ${base.global?.colors?.['light-3']};
  }
  box-sizing: border-box;
  &:hover {
    outline: 1px solid ${base.global?.colors?.['brand']};
  }
`;

const PlanRow: FC<PlanRowProps> = (props) => {
  const totalMeals = props.quantities.reduce((accum, item) => accum + item, 0);
  return (
    <AlternatingTableRow>
      <TableCell scope="row">{props.plan}</TableCell>
      {[...new Array(props.defaultDeliveryDays.length)].map((_, index) => (
        <TableCell key={`${props.plan}-${index + 1}`}>
          <ThemeContext.Extend
            value={{
              global: {
                input: {
                  padding: '0',
                  font: {
                    weight: 400,
                  },
                },
              },
            }}
          >
            <Select
              plain
              options={selectRange.map((item) => String(item))}
              value={String(props.quantities[index])}
              onChange={(event) => {
                const newQuantities = [...props.quantities];
                newQuantities[index] = Number.parseInt(event.value, 10);
                props.onChange(props.plan, newQuantities);
              }}
            />
          </ThemeContext.Extend>
        </TableCell>
      ))}

      <TableCell>{totalMeals}</TableCell>
    </AlternatingTableRow>
  );
};

export default PlanRow;
