import { FC } from 'react';

import { MenuPaddedContent } from '../menu-padded-content';
import { AdminTemplate } from '../admin-template';
import { EditCustomerPage } from '@tnmw/admin-app';

import { useRouter } from 'next/router';
import { useCustomer } from '../../../hooks/use-customer';
import { useCustomisations } from '../../../hooks';

const EditCustomer: FC = () => {
  const router = useRouter();
  console.log(router.query)
  const { username } = router.query;
  const { items: customisations } = useCustomisations();
  const { data } = useCustomer(
    Array.isArray(username) ? username[0] : username
  );

  console.log(data)

  return (
    <MenuPaddedContent>
      <AdminTemplate>
        {data && (
          <EditCustomerPage customer={data} customisations={customisations} />
        )}
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default EditCustomer;
