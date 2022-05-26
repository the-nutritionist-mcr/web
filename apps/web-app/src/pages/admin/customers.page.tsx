import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { Customers } from '@tnmw/admin-app';
import { useAuthorisation, useCustomisations } from '../../hooks';
import { FC } from 'react';
import { useCustomers } from '../../hooks/use-customers';
import { authorizedRoute } from '../../utils/authorised-route';

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

export const getServerSideProps = authorizedRoute({ groups: ['admin'] });
