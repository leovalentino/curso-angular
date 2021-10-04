import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeSerivce} from '../recipes/recipe.serivce';
import {Recipe} from '../recipes/recipe.model';
import {map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeSerivce) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put('https://ng-course-recipe-book-7a77b-default-rtdb.firebaseio.com/recipes.json', recipes)
      .subscribe(console.log);
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://ng-course-recipe-book-7a77b-default-rtdb.firebaseio.com/recipes.json')
      .pipe(map(recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []};
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes);
        })
      );
  }

}
