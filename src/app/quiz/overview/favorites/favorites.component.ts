import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Deck } from '../../../quiz/deck/deck';
import { DeckService } from '../../../services/deck.service';
import { SnackBarService } from '../../../services/snack-bar.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit, AfterViewInit {
  columnsToDisplay = [
    'name',
    'topic',
    'subject',
    'author',
    'creationDate',
    'delete',
  ];
  favorites = new MatTableDataSource<Deck>();
  isLoading = false;

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.favorites.data.length >= 1;
  }

  constructor(
    private deckService: DeckService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getFavorites();
  }

  ngAfterViewInit(): void {
    this.favorites.sort = this.sort;
  }

  deleteFavorite(id: string, index: number): void {
    this.deckService.deleteFavorite(id).subscribe((data) => {
      const successMessage = 'Der Favorite wurde erfolgreich gelöscht!';
      this.removeFavoriteFromTable(index);
      this.snackBarService.open(successMessage);
    });
  }

  getFavorites(): void {
    this.deckService
      .getMyFavorites()
      .subscribe((favorites) => this.dataLoaded(favorites));
  }

  doFilter(value: string): void {
    this.favorites.filter = value.trim().toLocaleLowerCase();
  }

  removeFavoriteFromTable(index: number): void {
    this.favorites.data.splice(index, 1);
    this.favorites._updateChangeSubscription();
  }

  private dataLoaded(favorites: Deck[]): void {
    this.isLoading = false;
    this.favorites.data = favorites;
  }
}
