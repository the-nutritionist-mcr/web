import { FC } from 'react';
import { Exclusion } from '@tnmw/admin-app';
import { MenuPaddedContent } from './menu-padded-content';

import { Exclusions } from '@tnmw/admin-app';
import { useResource } from '../../hooks/use-resource';

const RecipesPage: FC = () => {
  const { data, create, remove, update } = useResource<Exclusion>('customisation');
  return data ? (
    <MenuPaddedContent>
      <Exclusions exclusions={data.items} create={create} remove={remove} update={update}/>
    </MenuPaddedContent>
  ) : (
    <>Loading</>
  );
};

export default RecipesPage;
