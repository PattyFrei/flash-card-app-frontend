import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Deck } from '../../quiz/deck/deck';
import { DeckService } from '../../services/deck.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-my-catalogues',
  templateUrl: './my-catalogues.component.html',
  styleUrls: ['./my-catalogues.component.scss'],
})
export class MyCataloguesComponent implements OnInit, AfterViewInit {
  columnsToDisplay = [
    'name',
    'topic',
    'subject',
    'questions',
    'creationDate',
    'edit',
    'delete',
  ];
  decks = new MatTableDataSource<Deck>();
  isLoading = false;

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.decks.data !== undefined;
  }

  constructor(
    private deckService: DeckService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.getMyDecks();
  }

  ngAfterViewInit(): void {
    this.decks.sort = this.sort;
  }

  getMyDecks(): void {
    this.deckService.getMyDecks().subscribe((decks) => this.dataLoaded(decks));
  }

  doFilter(value: string): void {
    this.decks.filter = value.trim().toLocaleLowerCase();
  }

  // TODO: confirm user selection with modal
  // TODO: error case
  deleteCollection(id: string, index: number): void {
    this.deckService.deleteDeck(id).subscribe((data) => {
      const successMessage = 'Das Quiz wurde erfolgreich gelöscht!';
      this.removeCollectionFromTable(index);
      this.snackBarService.open(successMessage);
    });
  }

  removeCollectionFromTable(index: number): void {
    // const index = this.cards.data.indexOf(item.id);
    this.decks.data.splice(index, 1);
    this.decks._updateChangeSubscription();
  }

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks.data = decks;
  }
}
