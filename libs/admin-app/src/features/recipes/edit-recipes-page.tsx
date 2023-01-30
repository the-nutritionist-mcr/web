import { Trash } from 'grommet-icons';
import {
  Header,
  Heading,
  Button,
  Box,
  Form,
  CardBody,
  FormField,
  TextInput,
  Select,
  Card,
  CardFooter,
} from 'grommet';
import React from 'react';

import { ParagraphText } from '@tnmw/components';
import { Exclusion, Recipe, HotOrCold } from '@tnmw/types';
import {
  formGrid,
  alternatesGrid,
  details,
  editRecipePage,
} from './edit-recipes.page.css';
import { v4 } from 'uuid';
import { Link } from '../../components';

export interface EditRecipesPageProps {
  recipe?: Recipe;
  customisations?: Exclusion[];
  onSave: (recipe: Recipe) => Promise<void>;
  onDuplicate: (recipe: Recipe) => Promise<void>;
  recipes?: Recipe[];
  title: string;
}

export const EditRecipesPage = (props: EditRecipesPageProps) => {
  const [dirty, setDirty] = React.useState(false);
  const defaultRecipe = props.recipe ?? {
    id: v4(),
    name: '',
    shortName: '',
    hotOrCold: HotOrCold.Hot,
    description: '',
    allergens: '',
    potentialExclusions: [],
    invalidExclusions: [],
    alternates: [],
  };
  const [recipe, setRecipe] = React.useState<Recipe>(defaultRecipe);
  // eslint-disable-next-line fp/no-mutating-methods
  const exclusions = (props.customisations ?? [])
    .slice()
    .sort((a, b) =>
      a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
    );

  const allRecipes = props.recipes ?? [];

  const onSubmit = async (): Promise<void> => {
    await props.onSave(recipe);
    setDirty(false);
  };

  const formRecipe = {
    ...recipe,
    invalidExclusions:
      recipe?.invalidExclusions?.map((exclusionId) =>
        exclusions.find((otherExclusion) => otherExclusion.id === exclusionId)
      ) ?? [],
  };
  return (
    <div className={editRecipePage}>
      <Header
        justify="start"
        gap="small"
        style={{ marginBottom: '2rem', marginTop: '1rem' }}
      >
        <Heading level={2}>{props.title}</Heading>
        <Button
          primary
          disabled={!dirty}
          label="Save"
          name="submit"
          onClick={() => {
            const id = recipe.id ?? v4();
            props.onSave({ ...recipe, id });
          }}
        />

        <Button
          primary
          label="Duplicate"
          name="duplicate"
          onClick={() => {
            props.onDuplicate({ ...recipe, id: v4() });
          }}
        />
      </Header>
      <Form
        style={{ width: '100%', maxWidth: '1460px' }}
        value={formRecipe}
        onReset={(): void => {
          setRecipe(defaultRecipe);
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
          setDirty(true);
        }}
        onSubmit={onSubmit}
      >
        <div className={details}>
          <Heading margin={{ bottom: '1rem' }} level={3}>
            Details
          </Heading>
          <div className={formGrid}>
            <FormField
              style={{ minWidth: '20rem' }}
              name="name"
              label="Name"
              required
            >
              <TextInput name="name" />
            </FormField>
            <FormField
              name="shortName"
              label="Short Name"
              required
              style={{ minWidth: '20rem' }}
            >
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
              <Select
                plain
                multiple
                closeOnChange={false}
                name="potentialExclusions"
                options={exclusions}
                labelKey="name"
                valueKey="name"
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
          </div>
        </div>
        <Heading level={3} margin={{ bottom: '1rem' }}>
          <Box gap="medium" direction="row">
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
                setDirty(true);
              }}
            />
          </Box>
        </Heading>
        {(recipe?.alternates?.length ?? 0) === 0 ? (
          <ParagraphText>
            No alternates configured for this recipe. Click the button above to
            add one.
          </ParagraphText>
        ) : (
          <div className={alternatesGrid}>
            {recipe.alternates?.map((alternate, index) => (
              <Card pad="medium">
                <CardBody>
                  <FormField label="Customisation">
                    <Select
                      options={exclusions}
                      value={alternate.customisationId}
                      onChange={(event) => {
                        const newAlternates = [...(recipe.alternates ?? [])];

                        newAlternates[index].customisationId = event.value;

                        setRecipe({
                          ...recipe,
                          alternates: newAlternates,
                        });
                        setDirty(true);
                      }}
                      labelKey="name"
                      valueKey={{ reduce: true, key: 'id' }}
                    />
                  </FormField>
                  <FormField label="Recipe">
                    <Select
                      onChange={(event) => {
                        const newAlternates = [...(recipe.alternates ?? [])];

                        newAlternates[index].recipeId = event.value;
                        setRecipe({
                          ...recipe,
                          alternates: newAlternates,
                        });
                        setDirty(true);
                      }}
                      // eslint-disable-next-line fp/no-mutating-methods
                      options={allRecipes
                        .slice()
                        .sort((a, b) =>
                          a.shortName.toLowerCase() > b.shortName.toLowerCase()
                            ? 1
                            : -1
                        )}
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
                      const newAlternates = [...(recipe.alternates ?? [])];

                      // eslint-disable-next-line fp/no-mutating-methods
                      newAlternates.splice(index, 1);

                      setRecipe({
                        ...recipe,
                        alternates: newAlternates,
                      });
                      setDirty(true);
                    }}
                  />
                  <Link
                    path={`/admin/edit-recipe/?recipeId=${alternate.recipeId}`}
                  >
                    Edit
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Form>
    </div>
  );
};
