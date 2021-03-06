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
  Text,
} from 'grommet';
import { table } from './recipes.css';

import EditRecipesDialog from './EditRecipesDialog';
import React from 'react';
import RecipesRow from '../recipes/RecipesRow';
import { defaultDeliveryDays } from '@tnmw/config';
import PlanningModeSummary from './PlanningModeSummary';
import { Recipe, Exclusion, WeeklyPlan, HotOrCold } from '@tnmw/types';

interface RecipesProps {
  recipes?: Recipe[];
  customisations?: Exclusion[];
  onSubmitPlan: (plan: WeeklyPlan) => void;
  create: (newRecipe: Recipe) => Promise<void>;
  remove: (recipeToRemove: Recipe) => Promise<void>;
  update: (recipeToUpdate: Recipe) => Promise<void>;
}

const Recipes: React.FC<RecipesProps> = (props) => {
  const recipes = props.recipes ?? [];
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
      <Header
        align="center"
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
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
            exclusions={props.customisations}
            recipe={{
              id: '0',
              shortName: '',
              hotOrCold: HotOrCold.Hot,
              name: '',
              description: '',
              potentialExclusions: [],
            }}
            title="Create Recipe"
            onOk={(recipe: Recipe): void => {
              props.create(recipe);
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
          <Table alignSelf="start" className={table}>
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
                  .map((recipe) => (
                    /* eslint-enable fp/no-mutating-methods */
                    <RecipesRow
                      exclusions={props.customisations}
                      update={props.update}
                      remove={props.remove}
                      plannerSelection={plannerSelection}
                      selectedDeliveryDay={selectedDelivery}
                      onSelect={(newPlannerSelection) =>
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
              onSubmit={props.onSubmitPlan}
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
