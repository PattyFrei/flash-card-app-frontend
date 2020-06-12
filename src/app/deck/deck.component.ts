import { Component, OnInit } from '@angular/core';
import { Card } from './../card/card';
import { CARDS } from './../card/mock-cards';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  cards = CARDS;
  selectedCard: Card;

  constructor() {}

  ngOnInit(): void {}

  onSelect(card: Card): void {
    this.selectedCard = card;
  }
}
