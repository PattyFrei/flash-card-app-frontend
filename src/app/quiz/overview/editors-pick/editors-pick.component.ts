import { Component, OnInit, Input } from '@angular/core';

import { AuthService } from '../../../services/auth.service';
import { Deck } from '../../quiz/../deck/deck';
import { DeckService } from '../../../services/deck.service';

@Component({
  selector: 'app-editors-pick',
  templateUrl: './editors-pick.component.html',
  styleUrls: ['./editors-pick.component.scss'],
})
export class EditorsPickComponent implements OnInit {
  favorites: Deck[];
  @Input() decks: Deck[];

  get isDataLoaded(): boolean {
    return this.decks !== undefined;
  }

  get areFavsLoaded(): boolean {
    return this.favorites !== undefined;
  }

  get loggedIn() {
    return this.auth.loggedIn;
  }

  constructor(private auth: AuthService, private deckService: DeckService) {}

  ngOnInit(): void {
    this.getFavorites();
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
}
