import { CookPlanGroup, PlanVariantConfiguration } from '@tnmw/meal-planning';
import { BackendCustomer } from '@tnmw/types';
import { RecipeVariantMap } from '../types/CookPlan';
import { DocumentDefinition } from './downloadPdf';
import formatPlanItem from './formatPlanItem';
import { PdfBuilder } from './pdf-builder';

const getCountString = (count: number) => (count > 1 ? ` x ${count}` : ``);
const mainPartOfPlan = (thing: string) => thing.split(' ')[0];

const totalMeals = (variantConfigs: PlanVariantConfiguration[]) =>
  variantConfigs.reduce((accum, item) => accum + item.count, 0);

const makeLabelCell = (
  name: string,
  variantConfigs: PlanVariantConfiguration[]
) => [
  {
    text: `${name} (x ${totalMeals(variantConfigs)})`,
    style: 'rowHeader',
  },
];

const formatRecipeVariantMapNoCustomisationsCell = (
  variantConfigs: PlanVariantConfiguration[]
) => ({
  // eslint-disable-next-line fp/no-mutating-methods
  ul: variantConfigs
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    .filter((config) => !config.customisation)
    .sort((a, b) => (a.fullName > b.fullName ? 1 : -1))
    .map((config) =>
      formatPlanItem(`${config.planName} x ${config.count}`, config)
    ),
});

const formatRecipeVariantMapCustomisationsCell = (
  variantConfigs: PlanVariantConfiguration[]
) => {
  // eslint-disable-next-line fp/no-mutating-methods
  const items = variantConfigs
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    .filter((config) => config.customisation)
    .flatMap((config) =>
      config.customers.map((customer) => ({
        string: `${config.fullName} - ${customer.surname}, ${customer.firstName}`,
        customer,
        item: config,
        key: config.fullName,
      }))
    )
    .reduce<
      {
        string: string;
        count: number;
        item: PlanVariantConfiguration;
        key: string;
        customer: BackendCustomer;
      }[]
    >((accum, item) => {
      const found = accum.find(
        (reducedItem) => reducedItem.string === item.string
      );
      if (found) {
        found.count++;
        return accum;
      } else {
        return [
          ...accum,
          {
            count: 1,
            ...item,
          },
        ];
      }
    }, [])
    .sort((a, b) => {
      if (mainPartOfPlan(a.key) !== mainPartOfPlan(b.key)) {
        return a.key > b.key ? 1 : -1;
      }
      return a.string > b.string ? 1 : -1;
    })
    .map((item) =>
      formatPlanItem(
        `${item.key}${getCountString(item.count)} - ${item.customer.surname}, ${
          item.customer.firstName
        }`,
        item.item
      )
    );
  return {
    ul: items,
  };
};

const generateCookPlanDocumentDefinition = (
  cookPlan: CookPlanGroup[][]
): DocumentDefinition => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const date = new Date(Date.now());

  const title = `TNM Cook Plan (printed ${date.toLocaleDateString(
    undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options as any
  )})`;

  const convertPlanToRows = (individualCookPlan: CookPlanGroup[]) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const all = Array.from(individualCookPlan.values())
      .slice()
      .sort((a, b) => {
        const aRecipe = a.mainRecipe;
        const bRecipe = b.mainRecipe;
        if (aRecipe.name > bRecipe.name) {
          return 1;
        }

        return -1;
      });
    return all.flatMap((group) => {
      return [
        [
          makeLabelCell(group.mainRecipe.name, group.primaries),
          formatRecipeVariantMapNoCustomisationsCell(group.primaries),
          formatRecipeVariantMapCustomisationsCell(group.primaries),
        ],
        group.alternates.map((alternateGroup) => [
          makeLabelCell(alternateGroup[0].recipe.name, alternateGroup),
          formatRecipeVariantMapNoCustomisationsCell(alternateGroup),
          formatRecipeVariantMapCustomisationsCell(alternateGroup),
        ]),
      ];
    });
  };

  const returnVal = cookPlan.reduce<PdfBuilder>(
    (builder, plan, index) =>
      builder
        .header(`Cook ${index + 1}`)
        .table(convertPlanToRows(plan), 2, [200, '*', '*'])
        .pageBreak(),
    new PdfBuilder(title, true)
  );
  return returnVal.toDocumentDefinition();
};

export default generateCookPlanDocumentDefinition;
