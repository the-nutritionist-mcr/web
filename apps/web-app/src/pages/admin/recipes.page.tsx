import { FC, useState } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import toast from 'react-hot-toast';
import { Recipes } from '@tnmw/admin-app';
import { useCustomisations, useRecipes } from '../../hooks';
import { swrFetcher } from '../../utils/swr-fetcher';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const RecipesPage: FC = () => {
  const [filter, setFilter] = useState<string | undefined>();
  const { items, create, remove, update } = useRecipes(filter);

  const { items: customisations } = useCustomisations();

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          <Recipes
            onSubmitPlan={async (plan) => {
              await swrFetcher('plan', {
                method: 'POST',
                body: JSON.stringify(plan),
              });
              toast.success(
                'New plan successfully generated! Check the planner page to view it'
              );
            }}
            customisations={customisations}
            recipes={items}
            create={create}
            onFilter={(filter: string) => setFilter(filter)}
            remove={remove}
            update={update}
          />
        </AdminTemplate>
      </MenuPaddedContent>
    </RedirectIfLoggedOut>
  );
};

export default RecipesPage;
