import { DocumentDefinition } from './downloadPdf';
import formatPlanItem from './formatPlanItem';
import { PdfBuilder } from './pdf-builder';
import { createVariant } from '@tnmw/meal-planning';
import { defaultDeliveryDays, itemFamilies } from '@tnmw/config';

import {
  Recipe,
  BackendCustomer,
  MealPlanGeneratedForIndividualCustomer,
  PlannedDelivery,
  Swapped,
  PlannedCook,
} from '@tnmw/types';
import moment from 'moment';
import { selectionIsIncludedInPlan } from './selection-is-included-in-plan';
import calendarFormat from './calendarFormat';

const COLUMNS = 6;

export interface CustomerMealDaySelection {
  customer: BackendCustomer;
  delivery: PlannedDelivery;
}

const makeRowsFromSelections = (
  customerSelections: Swapped<CustomerMealDaySelection>[],
  allMeals: Recipe[]
) =>
  // eslint-disable-next-line fp/no-mutating-methods
  customerSelections
    .slice()
    .sort((a, b) => (a.customer.surname > b.customer.surname ? 1 : -1))
    .filter((customerSelection) => selectionIsIncludedInPlan(customerSelection))
    .map((customerSelection, customerIndex) => ({
      style: {
        background: customerIndex % 2 === 0 ? '#D3D3D3' : 'white',
      },
      content: [
        [
          {
            fontSize: 10,
            text: generateNameString(customerSelection.customer),
            bold: true,
          },
        ],
        ...(customerSelection.delivery.paused
          ? [
              `Paused until ${moment(
                customerSelection.delivery.pausedUntil as Date
              ).calendar(null, calendarFormat)}`,
            ]
          : // eslint-disable-next-line fp/no-mutating-methods
            customerSelection.delivery.plans
              .slice()
              .sort((a, b) => {
                const labels = itemFamilies.map((family) => family.name);
                const aIndex = labels.indexOf(a.name);
                const bIndex = labels.indexOf(b.name);

                if (aIndex > bIndex) {
                  return 1;
                } else if (aIndex < bIndex) {
                  return -1;
                }

                return 0;
              })
              .flatMap((plan) => (plan.status === 'active' ? plan.meals : []))
              .map((item) =>
                createVariant(customerSelection.customer, item, allMeals)
              )
              .map((item) => formatPlanItem(item.mealWithVariantString, item))),
      ],
    }));

const generateNameString = (customer: BackendCustomer) =>
  `${customer.surname}, ${customer.firstName}`;

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

const generateDeliveryPlanDocumentDefinition = (
  selections: Swapped<MealPlanGeneratedForIndividualCustomer>[],
  allMeals: Recipe[],
  plannedCooks: PlannedCook[]
): DocumentDefinition => {
  const date = new Date(Date.now());

  const title = `TNM Pack Plan (printed ${date.toLocaleDateString(
    undefined,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options as any
  )})`;

  const newBuilder = new PdfBuilder(title, true);

  const builder = defaultDeliveryDays.reduce<PdfBuilder>(
    (topBuilder, _current, cookIndex) => {
      const daySelections = selections.map(({ customer, deliveries }) => ({
        customer,
        delivery: deliveries[cookIndex],
      }));

      const date = moment(plannedCooks[cookIndex].date).format(
        'dddd MMM Do YYYY'
      );

      return topBuilder
        .header(`Cook ${cookIndex + 1} // ${date}`)
        .table(makeRowsFromSelections(daySelections, allMeals), COLUMNS)
        .pageBreak();
    },
    newBuilder
  );

  return builder.toDocumentDefinition();
};

export default generateDeliveryPlanDocumentDefinition;
