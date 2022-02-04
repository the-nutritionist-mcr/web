import LoadingState from './LoadingState';
import { PlannerState } from '../features/planner/planner-reducer';

import customersSlice from '../features/customers/customersSlice';
import exclusionsSlice from '../features/exclusions/exclusionsSlice';
import recipesSlice from '../features/recipes/recipesSlice';

export default interface AppState {
  customers: ReturnType<typeof customersSlice.reducer>;
  exclusions: ReturnType<typeof exclusionsSlice.reducer>;
  recipes: ReturnType<typeof recipesSlice.reducer>;
  planner: PlannerState;
  loadingState: LoadingState;
  error?: string;
}
