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
export class FavoritesComponent implements OnInit {
  columnsToDisplay = ['name', 'topic', 'subject', 'author', 'creationDate'];
  favorites = new MatTableDataSource<Deck>();

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.favorites.data.length >= 1;
  }

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {}
}
