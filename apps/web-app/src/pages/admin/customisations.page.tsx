import { FC } from 'react';
import { Exclusion } from '@tnmw/admin-app';
import { MenuPaddedContent } from './menu-padded-content';

import { Exclusions } from '@tnmw/admin-app';
import { useResource } from '../../hooks/use-customisations';

const RecipesPage: FC = () => {
  const { data, create } = useResource<Exclusion>('customisation');
  return data ? (
    <MenuPaddedContent>
      <Exclusions exclusions={data.items} create={create} />
    </MenuPaddedContent>
  ) : (
    <>Loading</>
  );
};

export default RecipesPage;
