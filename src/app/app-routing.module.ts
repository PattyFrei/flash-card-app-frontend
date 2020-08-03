import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './auth.guard';
import { CardComponent } from './card/card.component';
import { PublicComponent } from './quiz/public/public.component';
import { ProfileComponent } from './profile/profile.component';
import { DeckComponent } from './deck/deck.component';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { CollectionComponent } from './editor/collection/collection.component';
import { QuestionComponent } from './editor/question/question.component';

const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'public', component: PublicComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  { path: 'deck/:id', component: DeckComponent },
  {
    path: 'collection/:id',
    component: CollectionComponent,
    canActivate: [AuthGuard],
  },
  { path: 'editor', component: EditorComponent, canActivate: [AuthGuard] },
  { path: 'home', component: HomeComponent },
  { path: 'card/:id', component: CardComponent },
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
