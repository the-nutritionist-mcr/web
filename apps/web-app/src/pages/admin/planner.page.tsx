import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Planner } from '@tnmw/admin-app';

const PlannerPage: FC = () => {
  return (
    <MenuPaddedContent>
      <AdminTemplate>
        <Planner />
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default PlannerPage;
