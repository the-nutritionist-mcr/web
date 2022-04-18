import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Planner } from '@tnmw/admin-app';
import { useRecipes, usePlan } from '../../hooks';

const PlannerPage: FC = () => {
  const { items } = useRecipes();
  const { data, update, publish } = usePlan();
  return (
    <MenuPaddedContent>
      <AdminTemplate>
        {data && data.available && (
          <Planner
            update={update}
            recipes={items}
            cooks={data.cooks}
            selections={data.selections}
            published={data.published}
            publish={publish}
          />
        )}
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default PlannerPage;
