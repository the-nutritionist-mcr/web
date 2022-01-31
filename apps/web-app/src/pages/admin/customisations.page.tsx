import { FC } from 'react';
import { MenuPaddedContent} from "./menu-padded-content"

import { Exclusions } from '@tnmw/admin-app';

const RecipesPage: FC = () => {
  return (
  <MenuPaddedContent>
    <Exclusions />
  </MenuPaddedContent>
  )
};

export default RecipesPage;
