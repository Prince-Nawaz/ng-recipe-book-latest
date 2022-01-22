import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import * as RecipeActions from './recipe.actions';
@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(RecipeActions.fetchRecipes),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://ng-recipe-book-50bb8.firebaseio.com/recipes.json'
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => {
        return RecipeActions.setRecipes({ recipes });
      })
    );
  });

  storeRecipes$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(RecipeActions.storeRecipes),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          console.log(actionData);
          return this.http.put(
            'https://ng-recipe-book-50bb8.firebaseio.com/recipes.json',
            recipesState.recipes
          );
        })
      );
    },
    { dispatch: false }
  );
  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}
