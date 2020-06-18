import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';

import { Card } from './../card/card';
import { Deck } from './deck';
import { DeckService } from './../deck.service';

@Component({
  selector: 'app-deck',
  templateUrl: './deck.component.html',
  styleUrls: ['./deck.component.scss'],
})
export class DeckComponent implements OnInit {
  selectedCard: Card;
  isLoading = false;
  deck$: Observable<Deck>;

  constructor(
    private deckService: DeckService,
    private location: Location, // enables navigation back
    private route: ActivatedRoute, // extracts param from URL
    private router: Router
  ) {
    // init local variables with values
    // wire parameters to props
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.deck$ = this.deckService.getDeck(id);
    console.log(this.deck$);
  } // hock method, fetch data here

  // gotoDecks(deck: Deck) {
  //   const deckId = deck ? deck.id : null;
  //   // Pass along the item id if available
  //   // so that the Catalogue component can select that item.
  //   this.router.navigate(['/catalogue', { id: deckId }]);
  // }

  // onSelect(card: Card): void {
  //   this.selectedCard = card;
  // }

  goBack(): void {
    this.location.back();
  }
}
