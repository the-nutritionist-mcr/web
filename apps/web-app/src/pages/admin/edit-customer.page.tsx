import { FC, useContext } from 'react';

import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';
import { EditCustomerPage } from '@tnmw/admin-app';
import toast from 'react-hot-toast';

import { useRouter } from 'next/router';
import { useCustomer } from '../../hooks/use-customer';
import { useCustomisations } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { swrFetcher } from '../../utils/swr-fetcher';
import { HTTP } from '../../infrastructure/constants';
import { ConfigContext } from '../../components/config-provider';

const resetPassword = async (payload: {
  username: string;
  newPassword: string;
  forceChange: boolean;
}): Promise<void> => {
  await swrFetcher('customer/reset-password', {
    method: HTTP.verbs.Post,
    body: JSON.stringify(payload),
  });
  toast.success('Customer password successfully reset!');
};

const EditCustomer: FC = () => {
  const router = useRouter();
  const { items: customisations } = useCustomisations();

  const id = router.query.userId;

  const userId = Array.isArray(id) ? id[0] : id;

  const { data, save, dirty } = useCustomer(userId);

  const { config } = useContext(ConfigContext);

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {data && customisations && (
            <EditCustomerPage
              chargebeeUrl={config?.ChargebeeUrl ?? ''}
              resetPassword={resetPassword}
              saveCustomer={save}
              dirty={dirty}
              customer={data}
              // eslint-disable-next-line fp/no-mutating-methods
              customisations={customisations
                .slice()
                .sort((a, b) =>
                  a.name.toLocaleLowerCase() > b.name.toLocaleLowerCase()
                    ? 1
                    : -1
                )}
            />
          )}
        </AdminTemplate>
      </MenuPaddedContent>
    </RedirectIfLoggedOut>
  );
};

export default EditCustomer;
