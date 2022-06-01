import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromAppState from '../../store/app.reducer';
import {map, switchMap} from 'rxjs/operators';
import * as RecipeActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.action';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.scss']
})
export class RecipeDetailComponent implements OnInit {

  recipe: Recipe;
  id: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private store: Store<fromAppState.AppState>) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => +params['id']),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipeState =>  recipeState.recipes.find((recipe, index) => index === this.id)))
      .subscribe(recipe => this.recipe = recipe);
  }

  onAddtoShoppingList() {
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(ShoppingListActions.addIngredients({ ingredients: this.recipe.ingredients }));
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
    //this.router.navigate([../], this.id, 'edit', {relativeTo: this.route});
  }

  onDelete() {
    this.store.dispatch(RecipeActions.deleteRecipe({ index: this.id }));
    this.router.navigate(['/recipes']);
  }

}
