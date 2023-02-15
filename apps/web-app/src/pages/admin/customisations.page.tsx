import { FC, useEffect, useState } from 'react';
import { MenuPaddedContent } from './menu-padded-content';
import { AdminTemplate } from './admin-template';

import { Exclusions } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { useRouter } from 'next/router';

const CustomisationsPage: FC = () => {
  const router = useRouter();
  const page = Number(router.query.page ?? 1);
  const { items, count, create, remove, update } = useCustomisations(page);

  // eslint-disable-next-line fp/no-mutating-methods
  useEffect(() => {
    console.log({ page: router.query.page });
    if (!router.query.page) {
      // eslint-disable-next-line fp/no-mutating-methods
      router.push(`/admin/customisations?page=${page}`);
    }
  }, [page, router]);

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
            totalCount={count ?? 0}
            remove={remove}
            update={update}
          />
        </AdminTemplate>
      </MenuPaddedContent>
    </RedirectIfLoggedOut>
  );
};

export default CustomisationsPage;
