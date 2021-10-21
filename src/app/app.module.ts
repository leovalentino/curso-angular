import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from './shared/alert/shared.module';
import {CoreModule} from './core.module';
import {StoreModule} from '@ngrx/store';
import {shoppingListReducer} from './shopping-list/store/shopping-list.reducer';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent
    ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    StoreModule.forRoot({shoppingList: shoppingListReducer}),
    CoreModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
