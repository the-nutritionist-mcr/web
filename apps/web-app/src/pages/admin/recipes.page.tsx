import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';

import { Recipes } from '@tnmw/admin-app';
import { useCustomisations, useRecipes } from '../../hooks';
import { AdminTemplate } from './admin-template';
import { swrFetcher } from '../../utils/swr-fetcher';

const RecipesPage: FC = () => {
  const { items, create, remove, update } = useRecipes();
  const { items: customisations } = useCustomisations();

  return (
    <MenuPaddedContent>
      <AdminTemplate>
        <Recipes
          onSubmitPlan={async (plan) => {
            await swrFetcher('plan', {
              method: 'POST',
              body: JSON.stringify(plan),
            });
          }}
          customisations={customisations}
          recipes={items}
          create={create}
          remove={remove}
          update={update}
        />
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default RecipesPage;
