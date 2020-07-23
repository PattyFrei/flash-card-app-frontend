import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Card } from '../../card/card';
import { DeckService } from '../../deck.service';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
})
export class MyQuestionsComponent implements OnInit, AfterViewInit {
  cards = new MatTableDataSource<Card>();
  // columnsToDisplay = ['name', 'topic', 'subject', 'creationDate'];
  columnsToDisplay = ['questionText', 'creationDate'];
  isLoading = false;
  selectedId: string;

  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.cards.data !== undefined;
  }

  constructor(private deckService: DeckService) {}

  ngOnInit() {
    this.isLoading = true;
    this.getMyCards();
  }

  ngAfterViewInit(): void {
    this.cards.sort = this.sort;
  }

  getMyCards(): void {
    this.deckService.getMyCards().subscribe((cards) => this.dataLoaded(cards));
  }

  doFilter(value: string): void {
    this.cards.filter = value.trim().toLocaleLowerCase();
  }

  private dataLoaded(cards: Card[]): void {
    this.isLoading = false;
    this.cards.data = cards;
  }
}
