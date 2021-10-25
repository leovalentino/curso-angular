import {NgModule} from '@angular/core';
import {RecipeSerivce} from './recipes/recipe.serivce';
import {RecipeGuardService} from './recipes/recipe-guard.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptorService} from './auth/auth-interceptor.service';

@NgModule({
  providers: [
    RecipeSerivce, RecipeGuardService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ]
})
export class CoreModule {}
