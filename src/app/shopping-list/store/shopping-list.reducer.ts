import {Ingredient} from '../../shared/ingredient.model';
import * as ShoppingListActions from './shopping-list.action';
import {Action} from '@ngrx/store';

const initialState = {
  ingredients: [
    new Ingredient('Apples', 11),
    new Ingredient('Tomatoes', 5)
  ]
};

export function shoppingListReducer(state = initialState, action: ShoppingListActions.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListActions.ADD_INGREDIENT:
      return {
        ...state,
        ingredients: [...state.ingredients, action.payload]
      };
    case ShoppingListActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload]
      };
    case ShoppingListActions.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[action.payload.index];
      const updatedIngredient = {
        ...ingredient,
        ...action.payload.ingredient
      };
      const updatedIgredients = [...state.ingredients];
      updatedIgredients[action.payload.index] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIgredients
      };
    case ShoppingListActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, igIndex) => igIndex !== action.payload)
      };
    default:
      return state;
  }
}
