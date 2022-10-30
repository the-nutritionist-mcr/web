import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Planner } from '@tnmw/admin-app';
import { useRecipes, usePlan } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { useCustomers } from '../../hooks/use-customers';

const PlannerPage: FC = () => {
  const { items } = useRecipes();
  const { data, update, publish } = usePlan();
  const { items: customers } = useCustomers();

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {data && items && data.available && data.admin && customers && (
            <Planner
              update={update}
              recipes={items}
              createdBy={data.plan.createdBy}
              creationDate={data.date}
              customers={customers}
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
