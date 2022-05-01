import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { EditCustomerPage } from '@tnmw/admin-app';

const PlannerPage: FC = () => {
  return (
    <MenuPaddedContent>
      <AdminTemplate>
        <EditCustomerPage />
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default PlannerPage;
