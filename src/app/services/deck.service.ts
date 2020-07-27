import { catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';

import { Card } from './../card/card';
import { Deck } from './../deck/deck';
import { Difficulty } from './../deck/deck';
import { DIFFICULTIES } from './../deck/difficulties';
import { Subject } from './../card/card';
import { SUBJECTS } from './../card/subjects';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  constructor(private httpClient: HttpClient) {}

  getImage(imageId: string): Observable<Blob> {
    return this.httpClient
      .get<Blob>(`images/${imageId}`)
      .pipe(catchError(this.handleError));
  }

  uploadFile(formData: FormData): Observable<FormData> {
    return this.httpClient
      .post<FormData>(`images`, formData)
      .pipe(catchError(this.handleError));
  }

  createCard(card: Card): Observable<Card> {
    return this.httpClient
      .post<Card>(`cards`, card)
      .pipe(catchError(this.handleError));
  }

  createDeck(deck: Deck): Observable<Deck> {
    return this.httpClient
      .post<Deck>(`decks`, deck)
      .pipe(catchError(this.handleError));
  }

  getDeck(id: string): Observable<Deck> {
    return this.httpClient
      .get<Deck>(`decks/${id}`)
      .pipe(catchError(this.handleError));
  }

  getDecks(): Observable<Deck[]> {
    return this.httpClient
      .get<Deck[]>('decks')
      .pipe(catchError(this.handleError));
  }

  getMyDecks(): Observable<Deck[]> {
    return this.httpClient
      .get<Deck[]>('me/decks')
      .pipe(catchError(this.handleError));
  }

  getMyCards(): Observable<Card[]> {
    return this.httpClient
      .get<Card[]>('me/cards')
      .pipe(catchError(this.handleError));
  }

  getSubjects(): Observable<Subject[]> {
    return of(SUBJECTS);
  }

  getDifficulties(): Observable<Difficulty[]> {
    return of(DIFFICULTIES);
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.message}`
      );
    }
    // return an observable with a user-facing error message
    return throwError(
      'Ein Fehler ist aufgetreten, versuche es später noch einmal.'
    );
  }
}
