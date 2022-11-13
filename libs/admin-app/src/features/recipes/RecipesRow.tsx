import { Button, CheckBox, TableCell, TableRow } from 'grommet';
import { Edit, Trash } from 'grommet-icons';

import { OkCancelDialog } from '../../components';
import React, { useContext } from 'react';
import { Recipe, Exclusion } from '@tnmw/types';
import styled from 'styled-components';
import { NavigationContext } from '@tnmw/utils';
import { CustomisationsCell } from '../customers/customisations-cell';
import { actionsCell } from '../customers/customers.css';

const SlimButton = styled(Button)`
  padding: 0 5px 0 5px;
`;

interface RecipesRowProps {
  recipe: Recipe;
  exclusions?: Exclusion[];
  onChange: (newRecipe: Recipe) => void;
  remove: (recipe: Recipe) => Promise<void>;
  update: (recipe: Recipe) => Promise<void>;
  showCheckBoxes: boolean;
  plannerMode: boolean;
  selectedDeliveryDay: number;
  recipes?: Recipe[];
  plannerSelection: Recipe[][];
  onSelect: (plannerSelection: Recipe[][]) => void;
}

const RecipesRow: React.FC<RecipesRowProps> = (props) => {
  const [showDoDelete, setShowDoDelete] = React.useState(false);

  const { navigate } = useContext(NavigationContext);

  const selectedDelivery =
    props.plannerSelection[props.selectedDeliveryDay] ?? [];

  const deliveryChecked = selectedDelivery.some(
    (item) => item.id === props.recipe.id
  );

  return (
    <TableRow>
      {props.showCheckBoxes && (
        <TableCell>
          {
            <CheckBox
              checked={deliveryChecked}
              onChange={(event) => {
                if (event.target.checked) {
                  const newSelection = props.plannerSelection.map(
                    (delivery) => [...delivery]
                  );
                  // eslint-disable-next-line fp/no-mutating-methods
                  newSelection[props.selectedDeliveryDay].push(props.recipe);
                  props.onSelect(newSelection);
                } else {
                  const newSelection = props.plannerSelection.map(
                    (delivery) => [...delivery]
                  );
                  newSelection[props.selectedDeliveryDay] = newSelection[
                    props.selectedDeliveryDay
                  ].filter((item) => item.id !== props.recipe.id);
                  props.onSelect(newSelection);
                }
              }}
            />
          }
        </TableCell>
      )}
      <TableCell>{props.recipe.shortName}</TableCell>
      <TableCell>{props.recipe.name}</TableCell>
      <TableCell>{props.recipe.description}</TableCell>
      {!props.plannerMode && (
        <TableCell>
          <CustomisationsCell
            keyPrefix={`recipe-${props.recipe.id}`}
            customisations={props.recipe.potentialExclusions}
          />
        </TableCell>
      )}

      {!props.plannerMode && (
        <TableCell>
          <div className={actionsCell}>
            <SlimButton
              onClick={(): void => setShowDoDelete(true)}
              icon={<Trash color="light-6" />}
              a11yTitle="Delete"
            />

            <OkCancelDialog
              show={showDoDelete}
              header="Are you sure?"
              thing={props.recipe}
              onOk={(): void => {
                setShowDoDelete(false);
                props.remove(props.recipe);
              }}
              onCancel={(): void => setShowDoDelete(false)}
            >
              Are you sure you want to delete this recipe?
            </OkCancelDialog>

            <SlimButton
              secondary
              onClick={() =>
                navigate?.(`/admin/edit-recipe?recipeId=${props.recipe.id}`)
              }
              a11yTitle="Edit"
              icon={<Edit color="light-6" />}
            />
          </div>
        </TableCell>
      )}
    </TableRow>
  );
};

export default RecipesRow;
