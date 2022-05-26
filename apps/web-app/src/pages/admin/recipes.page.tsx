import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import toast, { Toaster } from 'react-hot-toast';
import { Recipes } from '@tnmw/admin-app';
import { useCustomisations, useRecipes } from '../../hooks';
import { swrFetcher } from '../../utils/swr-fetcher';
import { authorizedRoute } from '../../utils/authorised-route';

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
  );
};

export default RecipesPage;

export const getServerSideProps = authorizedRoute({ groups: ['admin'] });
