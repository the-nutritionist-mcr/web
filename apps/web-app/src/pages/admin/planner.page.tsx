import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Planner } from '@tnmw/admin-app';
import { useRecipes, usePlan } from '../../hooks';

const PlannerPage: FC = () => {
  const { items } = useRecipes();
  const { data, update } = usePlan();
  console.log(`page`, data);
  return (
    <MenuPaddedContent>
      <AdminTemplate>
        {data && (
          <Planner
            update={update}
            recipes={items}
            cooks={data.cooks}
            selections={data.selections}
          />
        )}
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default PlannerPage;
