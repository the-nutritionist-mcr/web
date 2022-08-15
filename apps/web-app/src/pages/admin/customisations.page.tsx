import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';

import { Exclusions } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';
import { authorizedRoute } from '../../utils/authorised-route';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const CustomisationsPage: FC = () => {
  const { items, create, remove, update } = useCustomisations();
  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          <Exclusions
            exclusions={items}
            create={create}
            remove={remove}
            update={update}
          />
        </AdminTemplate>
      </MenuPaddedContent>
    </RedirectIfLoggedOut>
  );
};

export default CustomisationsPage;
