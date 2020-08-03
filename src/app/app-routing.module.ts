import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';
import { CardComponent } from './quiz/card/card.component';
import { CatalogueComponent } from './editor/catalogue/catalogue.component';
import { DeckComponent } from './quiz/deck/deck.component';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { PublicComponent } from './quiz/public/public.component';
import { ProfileComponent } from './profile/profile.component';
import { MyCataloguesComponent } from './editor/my-catalogues/my-catalogues.component';
import { MyQuestionsComponent } from './editor/my-questions/my-questions.component';
import { QuestionComponent } from './editor/question/question.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'card/:id', component: CardComponent },
  {
    path: 'catalogue',
    component: CatalogueComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'catalogue/:id',
    component: CatalogueComponent,
    canActivate: [AuthGuard],
  },
  { path: 'deck/:id', component: DeckComponent },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'public', component: PublicComponent },
  {
    path: 'my-catalogues',
    component: MyCataloguesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-questions',
    component: MyQuestionsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question',
    component: QuestionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'question/:id',
    component: QuestionComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
