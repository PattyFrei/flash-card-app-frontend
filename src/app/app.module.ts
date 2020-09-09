import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicComponent } from './quiz/public/public.component';
import { CardComponent } from './quiz/card/card.component';
import { DeckComponent } from './quiz/deck/deck.component';
import { httpInterceptorProviders } from './http-interceptors/index';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { QuestionComponent } from './editor/question/question.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ProfileComponent } from './profile/profile.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { MatMenuModule } from '@angular/material/menu';
import { HomeComponent } from './home/home.component';
import { EditorComponent } from './editor/editor.component';
import { CatalogueComponent } from './editor/catalogue/catalogue.component';
import { MyQuestionsComponent } from './editor/my-questions/my-questions.component';
import { MyCataloguesComponent } from './editor/my-catalogues/my-catalogues.component';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OverviewComponent } from './quiz/overview/overview.component';
import { FavoritesComponent } from './quiz/overview/favorites/favorites.component';

@NgModule({
  declarations: [
    AppComponent,
    PublicComponent,
    CardComponent,
    DeckComponent,
    QuestionComponent,
    ProfileComponent,
    NavBarComponent,
    HomeComponent,
    EditorComponent,
    CatalogueComponent,
    MyQuestionsComponent,
    MyCataloguesComponent,
    OverviewComponent,
    FavoritesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    MatDividerModule,
    MatTabsModule,
    MatToolbarModule,
    MatIconModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    FormsModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatCardModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
