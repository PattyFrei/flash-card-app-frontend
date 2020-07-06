import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CardComponent } from './card/card.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { DeckComponent } from './deck/deck.component';
import { QuestionComponent } from './editor/question/question.component';

const routes: Routes = [
  { path: '', redirectTo: '/catalogue', pathMatch: 'full' },
  { path: 'catalogue', component: CatalogueComponent },
  { path: 'deck/:id', component: DeckComponent },
  { path: 'quiz/:id', component: CardComponent },
  { path: 'editor/question', component: QuestionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
