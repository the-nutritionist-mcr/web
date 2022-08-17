import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Planner } from '@tnmw/admin-app';
import { useRecipes, usePlan } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const PlannerPage: FC = () => {
  const { items } = useRecipes();
  const { data, update, publish } = usePlan();
  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {data && data.available && data.admin && (
            <Planner
              update={update}
              recipes={items}
              createdBy={data.plan.createdBy}
              creationDate={data.date}
              plan={data.plan}
              published={data.published}
              publish={publish}
            />
          )}
        </AdminTemplate>
      </MenuPaddedContent>
    </RedirectIfLoggedOut>
  );
};

export default PlannerPage;
