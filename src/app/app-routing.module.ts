import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { CardComponent } from './card/card.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DeckComponent } from './deck/deck.component';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'catalogue', component: CatalogueComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  { path: 'deck/:id', component: DeckComponent },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'card/:id', component: CardComponent },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
