import { FC } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { EditCustomerPage } from '@tnmw/admin-app';

import { useRouter } from 'next/router';
import { useCustomer } from '../../hooks/use-customer';
import { useCustomisations } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const EditCustomer: FC = () => {
  const router = useRouter();
  const { items: customisations } = useCustomisations();

  const id = router.query.userId;

  const userId = Array.isArray(id) ? id[0] : id;

  const { data, update, save, dirty } = useCustomer(userId);

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {data && customisations && (
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
    </RedirectIfLoggedOut>
  );
};

export default EditCustomer;