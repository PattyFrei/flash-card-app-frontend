import { Component, OnInit } from '@angular/core';

import { Deck } from '../deck/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  columnsToDisplay = ['name', 'topic', 'course', 'author'];
  decks: Deck[];
  isLoading = false;
  selectedId: string;

  get isDataLoaded(): boolean {
    return this.decks !== undefined;
  }

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    this.isLoading = true;
    // subscribe() passes the emitted array to the callback,
    // which sets the component's deck property
    this.deckService.getDecks().subscribe((decks) => this.dataLoaded(decks));
  }

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks = decks;
  }
}
