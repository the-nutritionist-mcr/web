import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DateInput,
  Header,
  Heading,
  Paragraph
} from 'grommet';
import React from 'react';
import Recipe from '../../domain/Recipe';
import { defaultDeliveryDays } from '../../lib/config';

interface PlanningModeSummaryProps {
  selectedDelivery: number;
  setSelectedDelivery: React.Dispatch<React.SetStateAction<number>>;
  setPlanningMode: React.Dispatch<React.SetStateAction<boolean>>;
  setPlannerSelection: React.Dispatch<React.SetStateAction<Recipe[][]>>;
  plannerSelection: Recipe[][];
}

const PlanningModeSummary: React.FC<PlanningModeSummaryProps> = props => {
  const [cookDates, setCookDates] = React.useState(
    props.plannerSelection.map<string | undefined>(() => undefined)
  );

  return (
    <Box
      direction="column"
      style={{
        padding: '10px',
        maxWidth: '25rem',
        alignItems: 'flex-start'
      }}
      gap="medium"
    >
      <Header direction="column">
        <Heading level={3} margin={{ top: '0', bottom: '0' }}>
          Planning Mode
        </Heading>
        <Paragraph margin={{ top: '0', bottom: '0' }} fill>
          You are in planning mode. To select meals for a delivery click one of
          the &apos;Pick Meals&apos; buttons below
        </Paragraph>
      </Header>

      {defaultDeliveryDays.map((_, index) => (
        <Card key={`delivery-{index + 1}`} width="100%">
          <CardHeader background="light-2" pad="medium">
            <strong>Cook {index + 1}</strong>
          </CardHeader>
          <CardBody pad="medium" gap="medium">
            <ul>
              {
                // eslint-disable-next-line security/detect-object-injection
                props.plannerSelection[index].length === 0 ? (
                  <li key="no-meals">No meals selected...</li>
                ) : (
                  // eslint-disable-next-line security/detect-object-injection
                  props.plannerSelection[index].map(recipe => (
                    <li
                      key={`${recipe.id}-planner`}
                      style={{ marginBottom: '0.5rem' }}
                    >
                      {recipe.name}
                    </li>
                  ))
                )
              }
            </ul>
            <DateInput
              value={
                // eslint-disable-next-line security/detect-object-injection
                cookDates[index]
              }
              format="mm/dd/yyyy"
              calendarProps={{
                daysOfWeek: true
              }}
              onChange={event => {
                const newCookDates = [...cookDates];
                if (!Array.isArray(event.value)) {
                  // eslint-disable-next-line security/detect-object-injection
                  newCookDates[index] = event.value;
                }
                setCookDates(newCookDates);
              }}
            />
          </CardBody>
          <CardFooter pad="medium">
            <Button
              label="Pick Meals"
              a11yTitle={`Cook ${index + 1}`}
              onClick={() => props.setSelectedDelivery(index)}
            />
          </CardFooter>
        </Card>
      ))}

      <Box direction="row" gap="small" width="100%">
        <Button
          primary
          size="small"
          label="Send to Planner"
          disabled={
            // eslint-disable-next-line unicorn/prefer-includes
            Boolean(cookDates.some(item => item === undefined))
          }
          a11yTitle="Send to Planner"
          style={{ flexGrow: 2 }}
          onClick={() => {
            // Noop
          }}
        />
        <Button
          primary
          size="small"
          label="Cancel"
          style={{ flexGrow: 2 }}
          a11yTitle="Cancel"
          onClick={() => {
            // Noop
          }}
        />
      </Box>
    </Box>
  );
};
export default PlanningModeSummary;
