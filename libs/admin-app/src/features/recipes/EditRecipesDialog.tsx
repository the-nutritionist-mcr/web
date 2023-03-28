import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Form,
  FormField,
  Heading,
  Layer,
  Select,
  TextInput,
} from 'grommet';
import { Checkmark, Close, Trash } from 'grommet-icons';
import { HotOrCold, Recipe, Exclusion } from '@tnmw/types';
import React from 'react';
import { debounce } from 'lodash';
import { ParagraphText } from '@tnmw/components';
import { TagInput } from '../../components';
import { ProjectedRecipe } from './Recipes';

interface EditRecipesDialogProps {
  recipe: Recipe;
  exclusions?: Exclusion[];
  onOk: (recipe: Recipe) => void;
  title: string;
  recipes?: ProjectedRecipe[];
  onCancel: () => void;
}

const ONSUBMIT_DEBOUNCE = 500;

const EditRecipesDialog: React.FC<EditRecipesDialogProps> = (props) => {
  const [recipe, setRecipe] = React.useState(props.recipe);
  // eslint-disable-next-line fp/no-mutating-methods
  const exclusions = (props.exclusions ?? [])
    .slice()
    .sort((a, b) =>
      a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
    );

  const recipes = props.recipes ?? [];

  const onSubmit = debounce(async (): Promise<void> => {
    props.onOk(recipe);
  }, ONSUBMIT_DEBOUNCE);

  const formRecipe = {
    ...recipe,
    invalidExclusions: recipe.invalidExclusions?.map((exclusionId) =>
      exclusions.find((otherExclusion) => otherExclusion.id === exclusionId)
    ),
  };

  return (
    <Layer style={{ zIndex: '2000' }}>
      <Card>
        <Form
          value={formRecipe}
          onReset={(): void => {
            setRecipe(props.recipe);
          }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(nextRecipeData: any): void => {
            const stateRecipe = {
              ...nextRecipeData,
              invalidExclusions:
                nextRecipeData.invalidExclusions?.map(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (exclusion: any) => exclusion.id
                ) ?? [],
            };
            setRecipe(stateRecipe);
          }}
          onSubmit={onSubmit}
        >
          <CardHeader margin="none" pad="medium" alignSelf="center">
            <Heading margin="none" level={3}>
              {props.title}
            </Heading>
          </CardHeader>
          <CardBody pad="large" alignSelf="center">
            <Box direction="row" gap="large">
              <Box direction="column" width="20rem" gap="small">
                <Heading margin="none" level={3}>
                  Details
                </Heading>
                <FormField name="name" label="Name" required>
                  <TextInput name="name" />
                </FormField>
                <FormField name="shortName" label="Short Name" required>
                  <TextInput name="shortName" />
                </FormField>
                <FormField name="description" label="Description">
                  <TextInput name="description" />
                </FormField>
                <FormField name="hotOrCold" label="Served" required>
                  <Select
                    options={[HotOrCold.Hot, HotOrCold.Cold, HotOrCold.Both]}
                    name="hotOrCold"
                  />
                </FormField>
                <FormField name="allergens" label="Allergens">
                  <TextInput name="allergens" />
                </FormField>
                <FormField name="potentialExclusions" label="Customisations">
                  <TagInput
                    options={exclusions.map((exclusion) => ({
                      key: exclusion.id,
                      label: exclusion.name,
                    }))}
                    onChange={(values) => {
                      const newRecipe = {
                        ...recipe,
                        potentialExclusions: values
                          .map((value) =>
                            exclusions.find(
                              (exclusion) => exclusion.id === value.key
                            )
                          )
                          .flatMap((value) => (value ? [value] : [])),
                      };
                      setRecipe(newRecipe);
                    }}
                    values={formRecipe.potentialExclusions.map((exclusion) => ({
                      key: exclusion.id,
                      label: exclusion.name,
                    }))}
                  />
                </FormField>
                <FormField name="invalidExclusions" label="Exclusions">
                  <Select
                    multiple
                    closeOnChange={false}
                    name="invalidExclusions"
                    options={exclusions}
                    labelKey="name"
                    valueKey="name"
                  />
                </FormField>
              </Box>
              <Box direction="column" width="20rem" gap="small">
                <Heading margin="none" level={3}>
                  <Box gap="medium" direction="row" justify="center">
                    <span>Alternates</span>
                    <Button
                      label="Add"
                      onClick={() => {
                        setRecipe({
                          ...recipe,
                          alternates: [
                            ...(recipe.alternates ?? []),
                            {
                              customisationId: '',
                              recipeId: '',
                            },
                          ],
                        });
                      }}
                    />
                  </Box>
                </Heading>
                {(recipe.alternates?.length ?? 0) === 0 ? (
                  <ParagraphText>
                    No alternates configured for this recipe. Click the button
                    below to add one.
                  </ParagraphText>
                ) : (
                  <Box gap="medium">
                    {recipe.alternates?.map((alternate, index) => (
                      <Card pad="medium">
                        <CardBody>
                          <FormField label="Customisation">
                            <Select
                              options={exclusions}
                              value={alternate.customisationId}
                              onChange={(event) => {
                                const newAlternates = [
                                  ...(recipe.alternates ?? []),
                                ];

                                newAlternates[index].customisationId =
                                  event.value;

                                setRecipe({
                                  ...recipe,
                                  alternates: newAlternates,
                                });
                              }}
                              labelKey="name"
                              valueKey={{ reduce: true, key: 'id' }}
                            />
                          </FormField>
                          <FormField label="Recipe">
                            <Select
                              onChange={(event) => {
                                const newAlternates = [
                                  ...(recipe.alternates ?? []),
                                ];

                                newAlternates[index].recipeId = event.value;
                                setRecipe({
                                  ...recipe,
                                  alternates: newAlternates,
                                });
                              }}
                              options={recipes}
                              value={alternate.recipeId}
                              labelKey="shortName"
                              valueKey={{ key: 'id', reduce: true }}
                            />
                          </FormField>
                        </CardBody>
                        <CardFooter>
                          <Button
                            icon={<Trash />}
                            hoverIndicator
                            onClick={() => {
                              const newAlternates = [
                                ...(recipe.alternates ?? []),
                              ];

                              // eslint-disable-next-line fp/no-mutating-methods
                              newAlternates.splice(index, 1);

                              setRecipe({
                                ...recipe,
                                alternates: newAlternates,
                              });
                            }}
                          />
                        </CardFooter>
                      </Card>
                    ))}
                  </Box>
                )}
              </Box>
            </Box>
          </CardBody>
          <CardFooter pad="medium" alignSelf="center" justify="center">
            <Button
              icon={<Checkmark color="brand" size="small" />}
              label="Ok"
              type="submit"
              name="submit"
            />
            <Button
              icon={<Close color="brand" size="small" />}
              onClick={props.onCancel}
              label="Cancel"
            />
            <Button type="reset" name="reset" label="Reset" />
          </CardFooter>
        </Form>
      </Card>
    </Layer>
  );
};

export default EditRecipesDialog;
