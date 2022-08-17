import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import toast, { Toaster } from 'react-hot-toast';
import { Recipes } from '@tnmw/admin-app';
import { useCustomisations, useRecipes } from '../../hooks';
import { swrFetcher } from '../../utils/swr-fetcher';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const RecipesPage: FC = () => {
  const { items, create, remove, update } = useRecipes();
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
            remove={remove}
            update={update}
          />
        </AdminTemplate>
      </MenuPaddedContent>
    </RedirectIfLoggedOut>
  );
};

export default RecipesPage;
