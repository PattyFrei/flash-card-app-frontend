import { Component, OnInit } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { Deck, Favorite } from '../quiz/../deck/deck';
import { DeckService } from '../../services/deck.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  decks: Deck[];
  favorites: Deck[];
  isFavorite = false;
  isLoading = false;

  get isDataLoaded(): boolean {
    return this.decks !== undefined;
  }

  get areFavsLoaded(): boolean {
    return this.favorites !== undefined;
  }

  get loggedIn() {
    return this.auth.loggedIn;
  }

  constructor(
    private auth: AuthService,
    private deckService: DeckService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllDecks();
  }

  getAllDecks(): void {
    this.deckService.getDecks().subscribe((decks) => this.dataLoaded(decks));
  }

  findFavorite(deckId: string): boolean {
    let isFavorite = false;
    this.favorites.forEach((favorite) => {
      if (favorite.id === deckId) {
        isFavorite = true;
      }
    });
    return isFavorite;
  }

  getFavorites(): void {
    if (this.loggedIn) {
      this.deckService.getMyFavorites().subscribe((favorites) => {
        this.favorites = favorites;
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

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks = decks.slice(0, 4);
    this.getFavorites();
  }
}
