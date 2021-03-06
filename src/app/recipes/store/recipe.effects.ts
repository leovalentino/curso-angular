import {Actions, createEffect, Effect, ofType} from '@ngrx/effects';
import * as RecipeActions from './recipe.actions';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Recipe} from '../recipe.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipeEffects {

  fetchRecipes$ = createEffect(() => this.actions$.pipe(
    ofType(RecipeActions.fetchRecipes),
    switchMap(() => {
      return this.http.get<Recipe[]>(
        'https://ng-course-recipe-book-7a77b-default-rtdb.firebaseio.com/recipes.json'
      );
    }),
    map(recipes => {
      return recipes.map(recipe => {
        return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
      });
    }),
    map(recipes => RecipeActions.setRecipes( { recipes }))
    )
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipeActions.storeRecipes),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
      return this.http.put('https://ng-course-recipe-book-7a77b-default-rtdb.firebaseio.com/recipes.json', recipesState.recipes);
    })
  );

  constructor(private actions$: Actions,
              private http: HttpClient,
              private store: Store<fromApp.AppState>) {}
}
