import { FC } from 'react';
import { MenuPaddedContent } from './menu-padded-content';

import { Exclusions } from '@tnmw/admin-app';
import { useCustomisations } from '../../hooks/use-customisations';

const RecipesPage: FC = () => {
  const { data } = useCustomisations();
  return data ? (
    <MenuPaddedContent>
      <Exclusions exclusions={data.items} />
    </MenuPaddedContent>
  ) : (
    <>Loading</>
  );
};

export default RecipesPage;
