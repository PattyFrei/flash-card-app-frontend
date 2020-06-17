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
  // decksObs: Observable<Deck[]>;
  selectedDeckId: string;
  isLoading = false;

  get isDataLoaded(): boolean {
    return this.decks !== undefined;
  }

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    this.isLoading = true;
    this.deckService.getDecks().subscribe((decks) => this.dataLoaded(decks));
    // this.decksObs = this.deckService.getDecks();
  }

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks = decks;
  }

  onSelect(deck: Deck): void {
    this.selectedDeckId = deck.id;
  }
}
