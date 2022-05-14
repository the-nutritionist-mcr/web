import { FC } from 'react';

import { MenuPaddedContent } from '../menu-padded-content';
import { AdminTemplate } from '../admin-template';
import { EditCustomerPage } from '@tnmw/admin-app';

import { useRouter } from 'next/router';
import { useCustomer } from '../../../hooks/use-customer';
import { useCustomisations } from '../../../hooks';

const EditCustomer: FC = () => {
  const router = useRouter();
  const { username } = router.query;
  const { items: customisations } = useCustomisations();

  const { data, update, save, dirty } = useCustomer(
    Array.isArray(username) ? username[0] : username
  );

  return (
    <MenuPaddedContent>
      <AdminTemplate>
        {data && (
          <EditCustomerPage
            saveCustomer={save}
            dirty={dirty}
            customer={data}
            customisations={customisations}
            updateCustomer={update}
          />
        )}
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default EditCustomer;
