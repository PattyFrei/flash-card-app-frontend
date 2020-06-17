import { Component, OnInit } from '@angular/core';
import { Deck } from '../deck/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  decks: Deck[];
  selectedDeck: Deck;
  selectedId: string;

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.getDecks();
  }

  getDecks(): void {
    this.deckService.getDecks().subscribe((decks) => (this.decks = decks));
  }

  onSelect(deck: Deck): void {
    this.selectedId = deck.id;
  }
}
