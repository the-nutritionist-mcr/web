import {
  Box,
  Button,
  Header,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text
} from 'grommet';

import EditRecipesDialog from './EditRecipesDialog';
import Recipe, { HotOrCold } from '../../domain/Recipe';
import React from 'react';
import RecipesRow from '../recipes/RecipesRow';
import { defaultDeliveryDays } from '../../lib/config';
import PlanningModeSummary from './PlanningModeSummary';

const Recipes: React.FC = () => {
  const recipes: Recipe[] = [];
  const error = '';
  const [planningMode, setPlanningMode] = React.useState(false);
  const [showCreate, setShowCreate] = React.useState(false);
  const [selectedDelivery, setSelectedDelivery] = React.useState(-1);
  const [plannerSelection, setPlannerSelection] = React.useState<Recipe[][]>(
    defaultDeliveryDays.map(() => [])
  );

  const showCheckBoxes = selectedDelivery !== -1 && planningMode;

  return (
    <React.Fragment>
      <Header align="center" justify="start" gap="small">
        <Heading level={2}>Recipes</Heading>
        <Button
          primary
          size="small"
          label="New"
          a11yTitle="New Customer"
          onClick={(): void => {
            setShowCreate(true);
          }}
        />
        {!planningMode && (
          <Button
            primary
            size="small"
            label="Planning Mode"
            a11yTitle="Planning Mode"
            onClick={() => setPlanningMode(true)}
          />
        )}

        {showCreate && (
          <EditRecipesDialog
            recipe={{
              id: '0',
              shortName: '',
              hotOrCold: HotOrCold.Hot,
              name: '',
              description: '',
              potentialExclusions: []
            }}
            title="Create Recipe"
            onOk={(): void => {
              setShowCreate(false);
            }}
            onCancel={(): void => {
              setShowCreate(false);
            }}
          />
        )}
      </Header>
      {error && <Text color="status-error">{error}</Text>}
      {recipes.length > 0 ? (
        <Box direction="row" gap="large">
          <Table alignSelf="start">
            <TableHeader>
              <TableRow>
                {showCheckBoxes && (
                  <TableCell>
                    <strong>Selected</strong>
                  </TableCell>
                )}
                {!planningMode && (
                  <TableCell>
                    <strong>Short Name</strong>
                  </TableCell>
                )}
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Description</strong>
                </TableCell>
                {!planningMode && (
                  <TableCell>
                    <strong>Customisations</strong>
                  </TableCell>
                )}
                {!planningMode && (
                  <TableCell>
                    <strong>Actions</strong>
                  </TableCell>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                /* eslint-disable fp/no-mutating-methods */
                recipes
                  .slice()
                  .sort((a, b) => (a.name < b.name ? 1 : -1))
                  .reverse()
                  .map(recipe => (
                    /* eslint-enable fp/no-mutating-methods */
                    <RecipesRow
                      plannerSelection={plannerSelection}
                      selectedDeliveryDay={selectedDelivery}
                      onSelect={newPlannerSelection =>
                        setPlannerSelection(newPlannerSelection)
                      }
                      showCheckBoxes={showCheckBoxes}
                      plannerMode={planningMode}
                      key={recipe.id}
                      recipe={recipe}
                      onChange={(): void => {
                        // Noop
                      }}
                    />
                  ))
              }
            </TableBody>
          </Table>
          {planningMode && (
            <PlanningModeSummary
              selectedDelivery={selectedDelivery}
              setPlanningMode={setPlanningMode}
              setPlannerSelection={setPlannerSelection}
              setSelectedDelivery={setSelectedDelivery}
              plannerSelection={plannerSelection}
            />
          )}
        </Box>
      ) : (
        <Text>
          You&apos;ve not added any recipes yet... Click the &apos;new&apos;
          button above to get started!
        </Text>
      )}
    </React.Fragment>
  );
};

export default Recipes;
