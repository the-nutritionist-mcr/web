import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';

import { Recipes } from '@tnmw/admin-app';
import { useCustomisations, useRecipes } from '../../hooks';

const RecipesPage: FC = () => {
  const { items, create, remove, update } = useRecipes();
  const { items: customisations } = useCustomisations();

  return (
    <MenuPaddedContent>
      <Recipes
        customisations={customisations}
        recipes={items}
        create={create}
        remove={remove}
        update={update}
      />
    </MenuPaddedContent>
  );
};

export default RecipesPage;
