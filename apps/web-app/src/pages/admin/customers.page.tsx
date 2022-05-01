import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Customers } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';
import { FC } from 'react';
import { useCustomers } from '../../hooks/use-customers';

const CustomersPage: FC = () => {
  const { items: customisations } = useCustomisations();
  const { items } = useCustomers();
  return (
    <MenuPaddedContent>
      <AdminTemplate>
        {items && (
          <Customers customers={items} customisations={customisations} />
        )}
      </AdminTemplate>
    </MenuPaddedContent>
  );
};

export default CustomersPage;
