import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeSerivce} from '../recipe.serivce';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.scss']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[];
  constructor(private recipeService: RecipeSerivce,
              private router: Router,
              private route: ActivatedRoute) {
    this.recipes = recipeService.getRecipes();
  }

  ngOnInit(): void {
  }

  onNewRecipe() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

}
