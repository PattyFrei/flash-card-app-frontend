import { Injectable } from '@angular/core';
import { Card } from './card/card';
import { CARDS } from './card/mock-cards';
import { Deck } from './deck/deck';
import { DECKS } from './deck/mock-decks';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  constructor() {}

  getCards(): Observable<Card[]> {
    return of(CARDS);
  }

  getDecks(): Observable<Deck[]> {
    return of(DECKS);
  }
}
