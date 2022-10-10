import { AdminTemplate } from './admin-template';
import { Customers } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';
import { FC } from 'react';
import { useCustomers } from '../../hooks/use-customers';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';

const CustomersPage: FC = () => {
  const { items: customisations } = useCustomisations();
  const { items } = useCustomers();
  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <AdminTemplate>
        {items && (
          <Customers customers={items} customisations={customisations ?? []} />
        )}
      </AdminTemplate>
    </RedirectIfLoggedOut>
  );
};

export default CustomersPage;
