import { DocumentDefinition } from './downloadPdf';
import formatPlanItem from './formatPlanItem';
import { PdfBuilder } from './pdf-builder';
import { createVariant, Delivery } from '@tnmw/meal-planning';
import { defaultDeliveryDays } from '@tnmw/config';

import {
  Recipe,
  CustomerMealsSelectionWithChargebeeCustomer,
  CustomerWithChargebeePlan,
} from '@tnmw/types';

const COLUMNS = 6;

interface CustomerMealDaySelection {
  customer: CustomerWithChargebeePlan;
  delivery: Delivery;
}

const makeRowsFromSelections = (
  customerSelections: CustomerMealDaySelection[],
  allMeals: Recipe[]
) =>
  customerSelections
    .slice()
    .sort((a, b) => (a.customer.surname > b.customer.surname ? 1 : -1))
    .map((customerSelection) => [
      [
        {
          fontSize: 10,
          text: generateNameString(customerSelection.customer),
          bold: true,
        },
        typeof customerSelection.delivery !== 'string'
          ? {
              ul: Object.entries(
                customerSelection.delivery
                  .map((item) => item.chosenVariant)
                  .reduce<Record<string, number>>(
                    (variantMap, variant) => ({
                      ...variantMap,
                      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                      [variant]: (variantMap[variant] ?? 0) + 1,
                    }),
                    {}
                  )
              ).map(([key, value]) => `${key} x ${value}`),
            }
          : '',
      ],
      [],
      ...(typeof customerSelection.delivery === 'string'
        ? [customerSelection.delivery]
        : customerSelection.delivery
            .map((item) =>
              createVariant(customerSelection.customer, item, allMeals)
            )
            .map((item) => formatPlanItem(item.mealWithVariantString, item))),
    ]);

const generateNameString = (customer: CustomerWithChargebeePlan) =>
  `${customer.surname}, ${customer.firstName}`;

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const generateDeliveryPlanDocumentDefinition = (
  selections: CustomerMealsSelectionWithChargebeeCustomer,
  allMeals: Recipe[]
): DocumentDefinition => {
  const date = new Date(Date.now());

  const title = `TNM Pack Plan (printed ${date.toLocaleDateString(
    undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options as any
  )})`;

  const builder = defaultDeliveryDays.reduce<PdfBuilder>(
    (topBuilder, current, cookIndex) => {
      const daySelections = selections.map(({ customer, deliveries }) => ({
        customer,
        delivery: deliveries[cookIndex],
      }));
      return topBuilder
        .header(`Cook ${cookIndex + 1}`)
        .table(makeRowsFromSelections(daySelections, allMeals), COLUMNS)
        .pageBreak();
    },
    new PdfBuilder(title, true)
  );

  return builder.toDocumentDefinition();
};

export default generateDeliveryPlanDocumentDefinition;
