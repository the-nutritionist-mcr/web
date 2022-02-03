import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';

import { Exclusions } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';

const CustomisationsPage: FC = () => {
  const { items, create, remove, update } = useCustomisations();
  return (
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
  );
};

export default CustomisationsPage;
