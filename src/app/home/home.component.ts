import { Component, OnInit } from '@angular/core';
import { Deck } from './../deck/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  decks: Deck[];

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.getDecks();
  }

  getDecks(): void {
    this.deckService.getDecks().subscribe((decks) => (this.decks = decks));
  }
}
