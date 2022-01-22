import { Action, createReducer, on } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
export interface State {
  recipes: Recipe[];
}
/* const recipes = [
  new Recipe(
    'Tasty Schnitzel',
    'A super-tasty Schnitzel - just awesome!',
    'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
    [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  ),
  new Recipe(
    'Big Fat Burger',
    'What else you need to say?',
    'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
    [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  ),
]; */
const initialState: State = {
  recipes: [],
};

const _recipeReducer = createReducer(
  initialState,
  on(RecipeActions.addRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.concat({ ...action.recipe }),
  })),
  on(RecipeActions.updateRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.map((recipe: Recipe, index: number) => {
      return index === action.index ? { ...action.recipe } : recipe;
    }),
  })),
  on(RecipeActions.deleteRecipe, (state, action) => ({
    ...state,
    recipes: state.recipes.filter((_, index: number) => {
      return index !== action.index;
    }),
  })),
  on(RecipeActions.setRecipes, (state, action) => ({
    ...state,
    recipes: [...action.recipes],
  }))
);

export function recipeReducer(state: State, action: Action) {
  return _recipeReducer(state, action);
}
