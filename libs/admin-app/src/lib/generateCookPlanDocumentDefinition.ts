import { BackendCustomer } from '@tnmw/types';
import { RecipeVariantMap } from '../types/CookPlan';
import { DocumentDefinition } from './downloadPdf';
import formatPlanItem from './formatPlanItem';
import { PdfBuilder } from './pdf-builder';

const getCountString = (count: number) => (count > 1 ? ` x ${count}` : ``);
const mainPartOfPlan = (thing: string) => thing.split(' ')[0];

const generateCookPlanDocumentDefinition = (
  cookPlan: Map<string, RecipeVariantMap>[]
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

  const formatRecipeVariantMapCustomisationsCell = (map: RecipeVariantMap) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const items = Object.keys(map)
      .slice()
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .filter((key) => map[key].customisation)
      .flatMap((key) =>
        map[key].customers.map((customer) => ({
          string: `${key} - ${customer.surname}, ${customer.firstName}`,
          customer,
          item: map[key],
          key,
        }))
      )
      .reduce<
        {
          string: string;
          count: number;
          item: RecipeVariantMap[string];
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
          `${item.key}${getCountString(item.count)} - ${
            item.customer.surname
          }, ${item.customer.firstName}`,
          item.item
        )
      );
    return {
      ul: items,
    };
  };

  const totalMeals = (map: RecipeVariantMap) =>
    Object.values(map).reduce((total, variant) => variant.count + total, 0);

  const formatRecipeVariantMapNoCustomisationsCell = (
    map: RecipeVariantMap
  ) => ({
    // eslint-disable-next-line fp/no-mutating-methods
    ul: Object.keys(map)
      .slice()
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
      .filter((key) => !map[key].customisation)
      .sort((a, b) => (a > b ? 1 : -1))
      .map((key) => formatPlanItem(`${key} x ${map[key].count}`, map[key])),
  });

  const makeLabelCell = (name: string, map: RecipeVariantMap) => [
    {
      text: `${name} (x ${totalMeals(map)})`,
      style: 'rowHeader',
    },
  ];

  const convertPlanToRows = (
    individualCookPlan: Map<string, RecipeVariantMap>
  ) => {
    // eslint-disable-next-line fp/no-mutating-methods
    const all = Array.from(individualCookPlan.entries())
      .slice()
      .sort((a, b) => {
        const aRecipe = Object.values(a[1])[0];
        const bRecipe = Object.values(b[1])[0];
        if (aRecipe.originalName > bRecipe.originalName) {
          return 1;
        }

        return -1;
      });
    return all.map(([recipeName, value]) => [
      makeLabelCell(recipeName, value),
      formatRecipeVariantMapNoCustomisationsCell(value),
      formatRecipeVariantMapCustomisationsCell(value),
    ]);
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
