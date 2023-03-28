import { RedirectIfLoggedOut } from '../../components/authentication/redirect-if-logged-out';
import { useCustomisations, useRecipes } from '../../hooks';
import AdminTemplate from './admin-template';
import { MenuPaddedContent } from './menu-padded-content';
import { EditRecipesPage } from '@tnmw/admin-app';
import { useContext } from 'react';
import { NavigationContext } from '@tnmw/utils';

const CreateRecipe = () => {
  const { items: customisations } = useCustomisations();
  const { items: recipes } = useRecipes();

  const { create } = useRecipes([]);
  const { navigate } = useContext(NavigationContext);

  return (
    <RedirectIfLoggedOut allowedGroups={['admin']} redirectTo="/login">
      <MenuPaddedContent>
        <AdminTemplate>
          {recipes && customisations && (
            <EditRecipesPage
              recipes={recipes}
              title="Create Recipe"
              onSave={async (recipe) => {
                await create(recipe);
                navigate?.(`/admin/recipes`);
              }}
              onDuplicate={async (recipe) => {
                await create(recipe);
                navigate?.(`/admin/edit-recipe/?recipeId=${recipe.id}`);
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

export default CreateRecipe;
