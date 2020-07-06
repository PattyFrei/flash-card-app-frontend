import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Deck } from '../deck/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit, AfterViewInit {
  columnsToDisplay = [
    'name',
    'topic',
    'subject',
    'course',
    'author',
    'creationDate',
  ];
  selectedId: string;
  decks = new MatTableDataSource<Deck>();

  @ViewChild(MatSort) sort: MatSort;

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    // subscribe() passes the emitted array to the callback,
    // which sets the component's deck property
    this.getAllDecks();
  }

  ngAfterViewInit(): void {
    this.decks.sort = this.sort;
  }

  getAllDecks(): void {
    this.deckService.getDecks().subscribe((res) => {
      this.decks.data = res as Deck[];
    });
  }

  doFilter(value: string): void {
    this.decks.filter = value.trim().toLocaleLowerCase();
  }
}
