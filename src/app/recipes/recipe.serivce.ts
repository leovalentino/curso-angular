import {Injectable} from '@angular/core';
import {Recipe} from './recipe.model';
import {Ingredient} from '../shared/ingredient.model';
import {Subject} from 'rxjs';
import {Store} from '@ngrx/store';
import * as ShoppingListActions from '../shopping-list/store/shopping-list.action';
import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class RecipeSerivce {
  recipesChanged = new Subject<Recipe[]>();

  /*private recipes: Recipe[] = [
    new Recipe(
      'Brazilian Feijoada',
      'A tasteful plate from Brazil',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Feijoada_%C3%A0_brasileira_-.jpg/766px-Feijoada_%C3%A0_brasileira_-.jpg',
      [
        new Ingredient('Rice', 1),
        new Ingredient('Beans', 20)
      ]),
    new Recipe(
      'Pasta',
      'What else you need to say?',
      'https://p1.pxfuel.com/preview/1000/747/802/food-drink-food.jpg',
      [
        new Ingredient('Noodle', 2),
        new Ingredient('Tomato Sauce', 1)
      ])
  ];*/
  private recipes: Recipe[] = [];

  constructor(private store: Store<fromApp.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    //this.slService.addIngredients(ingredients);
    this.store.dispatch(ShoppingListActions.addIngredients( { ingredients }));
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

}
