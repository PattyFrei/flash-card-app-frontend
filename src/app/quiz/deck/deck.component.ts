import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { Card } from './../card/card';
import { Deck, Favorite } from './deck';
import { DeckService } from './../../services/deck.service';
import { SnackBarService } from '../../services/snack-bar.service';

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
    private route: ActivatedRoute, // extracts param from URL
    private location: Location,
    private snackBarService: SnackBarService
  ) {
    // init local variables with values
    // wire parameters to props
  }

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.deckService.getDeck(id).subscribe((deck) => this.dataLoaded(deck));
  } // hock method, fetch data here

  onAddFavorite(id: string): void {
    const deckId: Favorite = { id };
    this.deckService.createFavorite(deckId).subscribe((favorite) => {
      const successMessage =
        'Der Katalog wurde erfolgreich zu deinen Favoriten hinzugefügt!';
      this.snackBarService.open(successMessage);
    });
  }

  onGoBack(): void {
    this.location.back();
  }

  private dataLoaded(deck: Deck): void {
    this.isLoading = false;
    this.deck = deck;
  }
}
