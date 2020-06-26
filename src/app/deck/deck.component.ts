import { ActivatedRoute } from '@angular/router';
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
  isLoading = false;
  deck: Deck;

  get isDataLoaded(): boolean {
    return this.deck !== undefined;
  }

  constructor(
    private deckService: DeckService,
    private route: ActivatedRoute // extracts param from URL
  ) {
    // init local variables with values
    // wire parameters to props
  }

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.deckService.getDeck(id).subscribe((deck) => this.dataLoaded(deck));
  } // hock method, fetch data here

  private dataLoaded(deck: Deck): void {
    this.isLoading = false;
    this.deck = deck;
  }
}
