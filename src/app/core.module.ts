import {NgModule} from '@angular/core';
import {RecipeSerivce} from './recipes/recipe.serivce';
import {ShoppingListService} from './shopping-list/shopping-list.service';
import {RecipeGuardService} from './recipes/recipe-guard.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from './auth/auth-interceptor.service';

@NgModule({
  providers: [
    RecipeSerivce, ShoppingListService, RecipeGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
})
export class CoreModule {}
