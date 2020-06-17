import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { CardComponent } from './card/card.component';
import { DeckComponent } from './deck/deck.component';
import { NoopInterceptor } from './http.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    CatalogueComponent,
    CardComponent,
    DeckComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [NoopInterceptor],
  bootstrap: [AppComponent],
})
export class AppModule {}
