import { FC } from 'react';
import { MenuPaddedContent} from "./menu-padded-content"

import { Recipes } from '@tnmw/admin-app';

const RecipesPage: FC = () => {
  return (
  <MenuPaddedContent>
    <Recipes />
  </MenuPaddedContent>
  )
};

export default RecipesPage;
