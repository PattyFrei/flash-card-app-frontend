import { Injectable } from '@angular/core';
import { Card } from './card/card';
import { CARDS } from './card/mock-cards';

@Injectable({
  providedIn: 'root',
})
export class DeckService {
  constructor() {}

  getCards(): Card[] {
    return CARDS;
  }
}
