import {
  CookPlanGroup,
  NewCookPlan,
  PlanVariantConfiguration,
} from '@tnmw/meal-planning';
import { BackendCustomer } from '@tnmw/types';
import moment from 'moment';
import { Content } from 'pdfmake/interfaces';
import { DocumentDefinition } from './downloadPdf';
import formatPlanItem from './formatPlanItem';
import { PdfBuilder } from './pdf-builder';
import { TableRowBorders, TableRowStyle } from './pdf-table';

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

const formatTotalPlanItemsCell = (
  variantConfigs: PlanVariantConfiguration[],
  rowSpan: number
) => {
  const countMap = new Map<string, number>();

  variantConfigs.forEach((config) =>
    countMap.set(
      config.planName,
      (countMap.get(config.planName) ?? 0) + config.count
    )
  );

  return {
    rowSpan,
    fillColor: 'white',
    // eslint-disable-next-line fp/no-mutating-methods
    ul: Array.from(countMap.entries()).map(
      ([plan, count]) => `${plan} x ${count}`
    ),
  };
};

const formatRecipeVariantMapCustomisationsCell = (
  variantConfigs: PlanVariantConfiguration[]
) => {
  // eslint-disable-next-line fp/no-mutating-methods
  const items = variantConfigs
    .slice()
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    .filter((config) => {
      return config.customisation;
    })
    .flatMap((config) => {
      return config.customers.map((customer) => ({
        string: `${config.fullName} - ${customer.surname}, ${customer.firstName}`,
        customer,
        item: config,
        key: config.fullName,
      }));
    })
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
  cookPlan: NewCookPlan[]
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

  type Row = Content[] | { content: Content[]; style: TableRowStyle };

  const convertPlanToRows = (individualCookPlan: CookPlanGroup[]): Row[] => {
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
    const result = all.map((group) => {
      const borders: TableRowBorders = [
        {
          width: 0,
        },
        {
          width: 0,
        },
        {
          width: 5,
        },
        {
          width: 0,
        },
      ];
      return [
        {
          content: [
            makeLabelCell(group.mainRecipe.name, group.primaries),
            formatRecipeVariantMapNoCustomisationsCell(group.primaries),
            formatRecipeVariantMapCustomisationsCell(group.primaries),
            formatTotalPlanItemsCell(
              [...group.primaries, ...group.alternates.flat()],
              1 + group.alternates.length
            ),
          ],
          style: {
            background: '#D3D3D3',
            borders,
          },
        },
        ...group.alternates.map((alternateGroup) => [
          makeLabelCell(alternateGroup[0].recipe.name, alternateGroup),
          formatRecipeVariantMapNoCustomisationsCell(alternateGroup),
          formatRecipeVariantMapCustomisationsCell(alternateGroup),
          { text: '' },
        ]),
      ];
    });

    return result.flat();
  };

  const newBuilder = new PdfBuilder(title, true);

  const returnVal = cookPlan.reduce<PdfBuilder>((builder, plan, index) => {
    const date = moment(plan.date).format('dddd MMM Do YYYY');
    return builder
      .header(`Cook ${index + 1} // ${date}`)
      .table(
        convertPlanToRows(
          plan.plan.flatMap((plan) => (plan.isExtra ? [] : [plan]))
        ),
        3,
        [200, '*', '*', 75]
      )
      .pageBreak();
  }, newBuilder);
  const dd = returnVal.toDocumentDefinition();
  return dd;
};

export default generateCookPlanDocumentDefinition;
