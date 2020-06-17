import { Component, OnInit } from '@angular/core';
import { Card } from './../card/card';
import { Deck } from './deck';
import { DeckService } from './../deck.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  selectedCard: Card;
  // cards: Card[];
  deck: Deck;

  constructor(private deckService: DeckService) {
    // init local variables with values
    // wire parameters to props
  }

  ngOnInit(): void {
    // subscribe() passes the emitted array to the callback,
    // which sets the component's cards property
    this.deckService
      .getDeck(this.deck.id)
      .subscribe((deck) => (this.deck = deck));
  } // hock method, fetch data here

  onSelect(card: Card): void {
    this.selectedCard = card;
  }
}
