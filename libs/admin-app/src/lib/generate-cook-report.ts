import { NewCookPlan } from '@tnmw/meal-planning';
import { MealPlanGeneratedForIndividualCustomer, Swapped } from '@tnmw/types';
import moment from 'moment';
import { DocumentDefinition } from './downloadPdf';
import { PdfBuilder } from './pdf-builder';
import { isLegimatePause } from './selection-is-included-in-plan';

const formatTotalCookCell = (
  cookPlan: NewCookPlan,
  selections: Swapped<MealPlanGeneratedForIndividualCustomer>[],
  cookIndex: number
) => {
  const countMap = new Map<string, number>();

  const variantConfigs = cookPlan.plan.flatMap((plan) => {
    return !plan.isExtra ? [...plan.primaries, ...plan.alternates.flat()] : [];
  });

  variantConfigs.forEach((config) =>
    countMap.set(
      config.planName,
      (countMap.get(config.planName) ?? 0) + config.count
    )
  );

  cookPlan.plan
    .flatMap((plan) => (plan.isExtra ? [plan] : []))
    .forEach((extra) => {
      countMap.set(extra.name, (countMap.get(extra.name) ?? 0) + extra.count);
    });

  const daySelections = selections.map(({ customer, deliveries }) => ({
    customer,
    delivery: deliveries[cookIndex],
  }));

  const pausedClients = daySelections.reduce(
    (accum, delivery) =>
      delivery.delivery.paused && isLegimatePause(delivery.delivery)
        ? accum + 1
        : accum,
    0
  );

  const activeClients = daySelections.reduce((accum, delivery) => {
    if (delivery.delivery.paused) {
      return accum;
    }

    if (
      delivery.delivery.plans.some(
        (plan) => plan.status === 'active' && plan.meals.length > 0
      )
    ) {
      return accum + 1;
    }

    return accum;
  }, 0);

  return [
    { style: 'smallHeader', text: 'Meals' },
    {
      fillColor: 'white',
      // eslint-disable-next-line fp/no-mutating-methods
      ul: Array.from(countMap.entries()).map(
        ([plan, count]) => `${plan} x ${count}`
      ),
    },
    { style: 'smallHeaderWithMargin', text: `Customers` },
    {
      ul: [
        `Active Clients: ${activeClients}`,
        `Paused Clients: ${pausedClients}`,
      ],
    },
  ];
};

export const generateCookReport = (
  cookPlan: NewCookPlan[],
  selections: Swapped<MealPlanGeneratedForIndividualCustomer>[]
): DocumentDefinition => {
  const date = new Date(Date.now());
  const title = `TNM Cook Report`;
  const pdf = new PdfBuilder(title);

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  const totalRows = cookPlan.map((cookPlan, index) => {
    const date = moment(cookPlan.date).format('MMM Do YYYY');
    return [
      { text: date, style: 'header' },
      formatTotalCookCell(cookPlan, selections, index),
    ];
  });

  return pdf
    .header(
      `Cook report (printed ${date.toLocaleDateString(
        undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        options as any
      )})`
    )
    .table(totalRows, 1, ['*', '*'])
    .toDocumentDefinition();
};
