import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Deck } from '../deck/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  decks: Deck[];
  // decksObs: Observable<Deck[]>;
  decks$: Observable<Deck[]>;
  isLoading = false;
  selectedId: string;

  get isDataLoaded(): boolean {
    return this.decks !== undefined;
  }

  constructor(
    private deckService: DeckService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.isLoading = true;
    // subscribe() passes the emitted array to the callback,
    // which sets the component's deck property
    this.deckService.getDecks().subscribe((decks) => this.dataLoaded(decks));
    // this.decksObs = this.deckService.getDecks();
    this.decks$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = params.get('id');
        return this.deckService.getDecks();
      })
    );
  }

  private dataLoaded(decks: Deck[]): void {
    this.isLoading = false;
    this.decks = decks;
  }
}
