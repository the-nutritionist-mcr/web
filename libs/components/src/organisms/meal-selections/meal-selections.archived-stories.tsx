import { Meta, Story } from '@storybook/react';

import MealSelectionsComponent, {
  MealSelectionsProps,
} from './meal-selections';

export default {
  title: 'organisms/Meal Selections',
  component: MealSelectionsComponent,
} as Meta;

const Template: Story<MealSelectionsProps> = (args) => (
  <MealSelectionsComponent {...args} />
);

export const MealSelections = Template.bind({});

MealSelections.args = {
  maxMeals: 4,
  maxBreakfasts: 2,
  maxSnacks: 3,
  snacksAvailable: [
    {
      id: '7',
      title: 'Protein chicken snack',
      description: 'Chicken, spinach, some sweet chilli sauce',
    },
    {
      id: '8',
      title: 'Protein balls',
      description: 'The munchy sweet thing I have sometimes',
    },
  ],
  breakfastsAvailable: [
    {
      id: '5',
      title: 'Some granola and yoghurt thing',
      description: 'Yeah its got all the raisens and nuts and stuff',
    },
    {
      id: '6',
      title: "Ryan's swiss musli",
      description:
        'Tastes good. Not sure what is in it, should make it myself one day',
    },
    {
      id: '1',
      title: 'French toast, fruit & yoghurt',
      description:
        'French toast, fresh seasonal fruit, greek yoghurt and mint garnish',
    },
  ],
  mealsAvailable: [
    {
      id: '11',
      title: 'Charred chicken burritto bowl',
      description:
        'Steamed rice, cumin seared onions + peppers, coriander, black beans, sour cream, vintage cheddar',
    },
    {
      id: '10',
      title: 'Sesame roast fillet of salmon',
      description:
        'Hoi sin stir fried vegetables, egg noodles, roasted peanuts, spring onions',
    },
    {
      id: '15',
      title: 'Chicken & pancetta linguine',
      description:
        'Wilted rocket, creme freche, young peas, courgette, parmesan, brocolli, cherry tomatos, fizzy pea shoots',
    },
    {
      id: '13',
      title: 'Creamy chicken + butter bean stew',
      description:
        'Sun dried tomatos, red peppers, cracked wheat, fine beans, chopped herbs',
    },

    {
      id: '16',
      title: 'Kaffir lime scented beef massaman',
      description:
        'Steamed rice & green peas, crispy shallots, roasted peanuts, red chilli, brocolli, coriander',
    },
  ],
};
