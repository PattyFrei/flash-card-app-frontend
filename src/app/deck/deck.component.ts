import { Component, OnInit } from '@angular/core';
import { Card } from './../card/card';
import { DeckService } from './../deck.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  selectedCard: Card;
  cards: Card[];

  constructor(private deckService: DeckService) {
    // init local variables with values
    // wire parameters to props
  }

  ngOnInit(): void {
    this.getCards();
  } // hock method, fetch data here

  getCards(): void {
    this.cards = this.deckService.getCards();
  }

  onSelect(card: Card): void {
    this.selectedCard = card;
  }
}
