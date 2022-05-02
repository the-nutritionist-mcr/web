import { FC } from 'react';

import { MenuPaddedContent } from '../menu-padded-content';
import { AdminTemplate } from '../admin-template';
import { EditCustomerPage } from '@tnmw/admin-app';

import { useRouter } from 'next/router';
import { useCustomer } from '../../../hooks/use-customer';

const PlannerPage: FC = () => {
  const router = useRouter();
  const { data } = useCustomer();
  const { username } = router.query;

  return (
    <MenuPaddedContent>
      <AdminTemplate>
        <EditCustomerPage />
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default PlannerPage;
