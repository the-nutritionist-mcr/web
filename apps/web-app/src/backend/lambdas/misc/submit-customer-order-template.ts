import { isSelectedMeal } from '@tnmw/meal-planning';
import { SelectedItem } from '@tnmw/types';

export const generateCustomerOrderEmail = (
  firstName: string,
  order: SelectedItem[][]
) => `
    <h1>Thanks for making your selection</h1>
    <p>Hey ${firstName}. This is just a quick note to let you know that your order has been received and will be included in next week&apos;s deliveries. If you change your mind, you can still log in and change your order at any point before Wednesday at 12pm</p>
    <table>
      <tbody>
      ${order
        .map(
          (delivery) =>
            `<tr>${
              typeof delivery === 'string'
                ? delivery
                : delivery.map(
                    (item) =>
                      `<td>${
                        isSelectedMeal(item)
                          ? item.recipe.name
                          : item.chosenVariant
                      }</td>`
                  )
            }</tr>`
        )
        .join('')}
      </tbody>
    </table>
`;
