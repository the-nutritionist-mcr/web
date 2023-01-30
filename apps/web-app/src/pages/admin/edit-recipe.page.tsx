import { useRouter } from 'next/router';
import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { useCustomisations, useRecipes } from '../../hooks';
import AdminTemplate from './admin-template';
import { MenuPaddedContent } from './menu-padded-content';
import { EditRecipesPage } from '@tnmw/admin-app';
import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';

const EditRecipe = () => {
  const router = useRouter();
  const { items: customisations } = useCustomisations();
  const { items: recipes } = useRecipes();

  const firstId = router.query.recipeId;

  const { navigate } = useContext(NavigationContext);

  const recipeId = Array.isArray(firstId) ? firstId[0] : firstId;

  const { items, update, create } = useRecipes(recipeId ? [recipeId] : []);
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
              onDuplicate={async (recipe) => {
                const response = await create({
                  ...recipe,
                  name: `${recipe.name} (copy)`,
                  shortName: `${recipe.shortName} (copy)`,
                });

                navigate?.(`/admin/edit-recipe/?recipeId=${response.id}`);
              }}
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
