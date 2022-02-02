import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';

import { Exclusions } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';

const CustomisationsPage: FC = () => {
  const { items, create, remove, update } = useCustomisations();
  return (
    <MenuPaddedContent>
      <Exclusions
        exclusions={items}
        create={create}
        remove={remove}
        update={update}
      />
    </MenuPaddedContent>
  );
};

export default CustomisationsPage;
