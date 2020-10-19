import { Component, OnInit, AfterViewInit, ViewChild, Input } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

import { Deck } from '../../quiz/../deck/deck';

@Component({
  selector: 'app-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss'],
})
export class PublicComponent implements OnInit, AfterViewInit {
  columnsToDisplay = ['name', 'topic', 'subject', 'author'];
  isLoading = false;

  @Input() decks: MatTableDataSource<Deck>;
  @ViewChild(MatSort) sort: MatSort;

  get isDataLoaded(): boolean {
    return this.decks.data.length >= 1;
  }

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.decks.sort = this.sort;
  }

  doFilter(value: string): void {
    this.decks.filter = value.trim().toLocaleLowerCase();
  }
}
