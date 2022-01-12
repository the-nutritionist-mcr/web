import {
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
} from "grommet";
import { Checkmark, Close } from "grommet-icons";
import Recipe, { HotOrCold } from "../../domain/Recipe";
import { useDispatch, useSelector } from "react-redux";
import { ApiRequestFunction } from "../../lib/apiRequestCreator";
import React from "react";
import { allExclusionsSelector } from "../../features/exclusions/exclusionsSlice";
import { debounce } from "lodash";

interface EditRecipesDialogProps {
  recipe: Recipe;
  thunk: ApiRequestFunction<Recipe>;
  onOk: () => void;
  title: string;
  onCancel: () => void;
}

const ONSUBMIT_DEBOUNCE = 500;

const EditRecipesDialog: React.FC<EditRecipesDialogProps> = (props) => {
  const [recipe, setRecipe] = React.useState(props.recipe);
  const dispatch = useDispatch();
  const exclusions = useSelector(allExclusionsSelector);

  const onSubmit = debounce(async (): Promise<void> => {
    // eslint-disable-next-line no-console
    console.log("SUBMITTING");
    await dispatch(props.thunk(recipe));
    props.onOk();
  }, ONSUBMIT_DEBOUNCE);

  const formRecipe = {
    ...recipe,
    invalidExclusions: recipe.invalidExclusions?.map(exclusionId =>
      exclusions.find(otherExclusion => otherExclusion.id === exclusionId)
    )
  };

  return (
    <Layer>
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
                ) ?? []
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
          <CardBody pad="medium" alignSelf="center">
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
            <FormField name="potentialExclusions" label="Customisations">
              <Select
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
