import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {Observable, Subscription} from 'rxjs';
import {LoggingService} from '../logging.service';
import {Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.action';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.scss']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ingredients: Ingredient[]}>;
  private idChangeSub: Subscription;

  constructor(private logingService: LoggingService,
              private store: Store<fromApp.AppState>) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
    /*this.ingredients = this.shoppingListService.getIngredients();
    this.idChangeSub = this.shoppingListService.ingredientsChanged.subscribe((ingredients) => {
      this.ingredients = ingredients;
    });*/
  }

  ngOnDestroy() {

  }

  onEditItem(index: number) {
    //this.shoppingListService.startEditing.next(index);
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

}
