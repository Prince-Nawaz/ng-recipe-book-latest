import { Action, createReducer, on } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.actions';
export interface State {
  ingredients: Ingredient[];
  editIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 15), new Ingredient('Tomatoes', 10)],
  editIndex: -1,
};

const _shoppingListReducer = createReducer(
  initialState,
  on(ShoppingListActions.addIngredient, (state, action) => ({
    ...state,
    ingredients: state.ingredients.concat(action.ingredient),
  })),
  on(ShoppingListActions.addIngredients, (state, action) => ({
    ...state,
    ingredients: state.ingredients.concat(...action.ingredients),
  })),
  on(ShoppingListActions.updateIngredient, (state, action) => ({
    ...state,
    editIndex: -1,
    ingredients: state.ingredients.map((ingredient, index) =>
      state.editIndex === index ? { ...action.ingredient } : ingredient
    ),
  })),
  on(ShoppingListActions.deleteIngredient, (state, action) => ({
    ...state,
    editIndex: -1,
    ingredients: state.ingredients.filter(
      (ingredient, index) => state.editIndex !== index
    ),
  })),
  on(ShoppingListActions.startEdit, (state, action) => ({
    ...state,
    editIndex: action.index,
  })),
  on(ShoppingListActions.stopEdit, (state, action) => ({
    ...state,
    editIndex: -1,
  }))
);

export function shoppingListReducer(state: State, action: Action) {
  return _shoppingListReducer(state, action);
}
