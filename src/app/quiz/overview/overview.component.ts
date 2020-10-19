import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

import { AuthService } from '../../services/auth.service';
import { Deck } from '../quiz/../deck/deck';
import { DeckService } from '../../services/deck.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  editorsPick: Deck[];
  isLoading = false;
  publicDecks = new MatTableDataSource<Deck>();

  get loggedIn() {
    return this.auth.loggedIn;
  }

  constructor(private auth: AuthService, private deckService: DeckService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getAllDecks();
  }

  getAllDecks(): void {
    this.deckService.getDecks().subscribe((decks) => this.dataLoaded(decks));
  }

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.publicDecks.data = decks;
    this.editorsPick = decks.slice(0, 4);
  }
}
