import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Customers } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';
import { FC } from 'react';

const CustomersPage: FC = () => {
  const { items: customisations } = useCustomisations();
  return (
    <MenuPaddedContent>
      <AdminTemplate>
        <Customers customers={[]} customisations={customisations} />
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default CustomersPage;
