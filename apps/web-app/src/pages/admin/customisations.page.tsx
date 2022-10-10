import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';

import { Exclusions } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const CustomisationsPage: FC = () => {
  const { items, create, remove, update } = useCustomisations();
  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          <Exclusions
            // eslint-disable-next-line fp/no-mutating-methods
            exclusions={items
              ?.slice()
              .sort((a, b) =>
                a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase() ? 1 : -1
              )}
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
