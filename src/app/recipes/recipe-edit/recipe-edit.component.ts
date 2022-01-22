import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';

import * as fromApp from '../../store/app.reducer';
import * as RecipeActions from '../store/recipe.actions';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css'],
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number = -1;
  editMode = false;
  recipeForm: FormGroup = new FormGroup({});
  private storeSub: Subscription | undefined;

  get ingredientsControls() {
    return (this.recipeForm!.get('ingredients') as FormArray).controls;
  }

  constructor(
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.editMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit() {
    // const newRecipe = new Recipe(
    //   this.recipeForm.value['name'],
    //   this.recipeForm.value['description'],
    //   this.recipeForm.value['imagePath'],
    //   this.recipeForm.value['ingredients']);
    if (this.editMode) {
      this.store.dispatch(
        RecipeActions.updateRecipe({
          recipe: this.recipeForm!.value,
          index: this.id,
        })
      );
    } else {
      this.store.dispatch(
        RecipeActions.addRecipe({ recipe: this.recipeForm!.value })
      );
    }
    this.onCancel();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm!.get('ingredients')).push(
      new FormGroup({
        name: new FormControl(null, Validators.required),
        amount: new FormControl(null, [
          Validators.required,
          Validators.pattern(/^[1-9]+[0-9]*$/),
        ]),
      })
    );
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm!.get('ingredients')).removeAt(index);
  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      this.storeSub = this.store
        .select('recipes')
        .pipe(
          map((recipeState) =>
            recipeState.recipes.find((recipe, index) => {
              return index === this.id;
            })
          )
        )
        .subscribe((recipe) => {
          recipeName = recipe!.name;
          recipeImagePath = recipe!.imagePath;
          recipeDescription = recipe!.description;
          if (recipe!['ingredients']) {
            for (let ingredient of recipe!.ingredients) {
              recipeIngredients.push(
                new FormGroup({
                  name: new FormControl(ingredient.name, Validators.required),
                  amount: new FormControl(ingredient.amount, [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/),
                  ]),
                })
              );
            }
          }
        });
    }

    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      imagePath: new FormControl(recipeImagePath, Validators.required),
      description: new FormControl(recipeDescription, Validators.required),
      ingredients: recipeIngredients,
    });
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
