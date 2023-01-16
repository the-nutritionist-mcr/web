import { useRouter } from 'next/router';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { useCustomisations, useRecipes } from '../../hooks';
import AdminTemplate from './admin-template';
import { MenuPaddedContent } from './menu-padded-content';
import { EditRecipesPage } from '@tnmw/admin-app';
import { useEffect, useState } from 'react';

const EditRecipe = () => {
  const router = useRouter();
  const { items: customisations } = useCustomisations();
  const { items: recipes } = useRecipes();

  const firstId = router.query.recipeId;

  console.log(firstId);

  const recipeId = Array.isArray(firstId) ? firstId[0] : firstId;

  const { items, update } = useRecipes(recipeId ? [recipeId] : []);
  const recipe = items?.[0];

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {recipe && recipes && customisations && (
            <EditRecipesPage
              key={recipe.id}
              recipes={recipes}
              title={items ? 'Edit Recipe' : 'Create Recipe'}
              recipe={recipe}
              onSave={async (recipe) => {
                await update(recipe);
              }}
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

export default EditRecipe;
