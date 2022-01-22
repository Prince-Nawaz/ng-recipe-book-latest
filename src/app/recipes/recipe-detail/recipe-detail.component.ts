import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | undefined;
  id: number | undefined;

  constructor(
    private store: Store<fromApp.AppState>,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params
      .pipe(
        map((params: Params) => {
          return +params['id'];
        }),
        switchMap((id: number) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipeState) =>
          recipeState.recipes.find((recipe, index) => {
            return index === this.id;
          })
        )
      )
      .subscribe((recipe: Recipe | undefined) => {
        this.recipe = recipe;
      });
  }

  onAddToShoppingList() {
    this.store.dispatch(
      ShoppingListActions.addIngredients({
        ingredients: this.recipe!.ingredients,
      })
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });
    // this.router.navigate(['../', this.id, 'edit'], {relativeTo: this.route});
  }

  onDeleteRecipe() {
    this.store.dispatch(RecipeActions.deleteRecipe({ index: this.id! }));
    this.router.navigate(['/recipes']);
  }
}
