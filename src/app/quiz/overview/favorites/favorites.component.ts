import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Deck } from '../../../quiz/deck/deck';
import { DeckService } from '../../../services/deck.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
})
export class FavoritesComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['name', 'topic', 'subject', 'author', 'creationDate'];
  favorites = new MatTableDataSource<Deck>();
  isLoading = false;

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.favorites.data.length >= 1;
  }

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getFavorites();
  }

  ngAfterViewInit(): void {
    this.favorites.sort = this.sort;
  }

  getFavorites(): void {
    this.deckService
      .getMyFavorites()
      .subscribe((favorites) => this.dataLoaded(favorites));
  }

  doFilter(value: string): void {
    this.favorites.filter = value.trim().toLocaleLowerCase();
  }

  private dataLoaded(favorites: Deck[]): void {
    this.isLoading = false;
    this.favorites.data = favorites;
  }
}
