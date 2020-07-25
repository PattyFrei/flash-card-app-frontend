import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Deck } from '../../deck/deck';
import { DeckService } from '../../services/deck.service';

@Component({
  selector: 'app-my-collections',
  templateUrl: './my-collections.component.html',
  styleUrls: ['./my-collections.component.scss'],
})
export class MyCollectionsComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['name', 'topic', 'subject', 'questions', 'creationDate'];
  decks = new MatTableDataSource<Deck>();
  isLoading = false;
  selectedId: string;

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.decks.data !== undefined;
  }

  constructor(private deckService: DeckService) {}

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

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks.data = decks;
    console.log('My decks:' + this.decks.data[0].id);
  }
}
