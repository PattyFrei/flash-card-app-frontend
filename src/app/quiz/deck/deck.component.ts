import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

import { AuthService } from '../../services/auth.service';
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
  favorites: Deck[];
  isFavorite = false;
  isLoading = false;
  deck: Deck;

  get isDataLoaded(): boolean {
    return this.deck !== undefined;
  }

  get loggedIn() {
    return this.auth.loggedIn;
  }

  constructor(
    private auth: AuthService,
    private deckService: DeckService,
    private route: ActivatedRoute,
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

  getFavorite(deckId: string): void {
    // this.deckService.getMyFavorite(deckId).subscribe((favorite) => {
    //   this.isFavorite = true;
    // });
    if (this.loggedIn) {
      this.deckService.getMyFavorites().subscribe((favorites) => {
        this.favorites = favorites;
        // refactor
        this.favorites.forEach((favorite) => {
          if (favorite.id === deckId) {
            this.isFavorite = true;
          }
        });
      });
    }
  }

  onAddFavorite(id: string): void {
    const deckId: Favorite = { id };
    this.deckService.createFavorite(deckId).subscribe((favorite) => {
      const successMessage = 'Der Katalog wurde zu deinen Favoriten hinzugefügt.';
      this.snackBarService.open(successMessage);
      this.isFavorite = true;
    });
  }

  onRemoveFavorite(id: string): void {
    const deckId = id;
    this.deckService.deleteFavorite(deckId).subscribe((favorite) => {
      const successMessage = 'Der Katalog wurde aus deinen Favoriten entfernt.';
      this.snackBarService.open(successMessage);
      this.isFavorite = false;
    });
  }

  onGoBack(): void {
    this.location.back();
  }

  private dataLoaded(deck: Deck): void {
    this.isLoading = false;
    this.deck = deck;
    this.getFavorite(deck.id);
  }
}
