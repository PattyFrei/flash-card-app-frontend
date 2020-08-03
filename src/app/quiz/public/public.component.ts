import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { AuthService } from '../../services/auth.service';
import { Deck } from '../../quiz/deck/deck';
import { DeckService } from '../../services/deck.service';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['name', 'topic', 'subject', 'author', 'creationDate'];
  isLoading = false;
  selectedId: string;
  decks = new MatTableDataSource<Deck>();

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.decks.data !== undefined;
  }

  constructor(public auth: AuthService, private deckService: DeckService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getAllDecks();
  }

  ngAfterViewInit(): void {
    this.decks.sort = this.sort;
  }

  getAllDecks(): void {
    // subscribe() passes the emitted array to the callback,
    // which sets the component's decks property
    this.deckService.getDecks().subscribe((decks) => this.dataLoaded(decks));
  }

  doFilter(value: string): void {
    this.decks.filter = value.trim().toLocaleLowerCase();
  }

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks.data = decks;
    console.log('First deck: ' + this.decks.data[0]);
  }
}
