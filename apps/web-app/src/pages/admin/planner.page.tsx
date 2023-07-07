import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Planner } from '@tnmw/admin-app';
import { useRecipes, usePlan, useCustomisations } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { useCustomers } from '../../hooks/use-customers';
import { usePlansList } from '../../hooks/use-plans-list';

const PlannerPage: FC = () => {
  const { items } = useRecipes();
  const { data, update, publish } = usePlan();
  const { data: plansList } = usePlansList();
  const { items: customers } = useCustomers();
  const { items: customisations } = useCustomisations();

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {customisations &&
            data &&
            items &&
            plansList &&
            data.available &&
            data.admin &&
            publish &&
            customers && (
              <Planner
                update={update}
                customisations={customisations}
                recipes={items}
                createdBy={data.plan.createdBy}
                creationDate={data.date}
                customers={customers}
                plan={data.plan}
                plansList={plansList}
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
