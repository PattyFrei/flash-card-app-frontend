import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Card, Answer } from './card';
import { Deck } from './../deck/deck';
import { DeckService } from '../deck.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  currentCard: Card;
  currentCardIndex = 0;
  deck: Deck;
  isLoading = false;
  selectedAnswer: Answer;
  toggleCheck = false;
  toggleExplanation = false;
  toggleResults = false;
  toggleNext = false;
  totalCorrectAnswers = 0;

  get isDataLoaded(): boolean {
    return this.deck !== undefined && this.toggleResults === false;
  }

  get isQuizCompleted(): boolean {
    return this.toggleResults === true;
  }

  constructor(
    private deckService: DeckService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.deckService.getDeck(id).subscribe((deck) => this.dataLoaded(deck));
  }

  onSelect(answer: Answer): void {
    this.selectedAnswer = answer;
    this.toggleCheck = true;
  }

  onCheck(): void {
    if (this.selectedAnswer.correctAnswer) {
      // mark answer with green
      this.totalCorrectAnswers++;
    } else {
      // mark answer with red and show explanation text
      this.toggleExplanation = true;
    }
    this.toggleNext = true;
    this.toggleCheck = false;
  }

  setCurrentCard(): void {
    this.toggleNext = false;
    this.currentCard = this.deck.questions[this.currentCardIndex];
    this.currentCardIndex++;
  }

  onNext(): void {
    if (this.currentCardIndex < this.deck.questions.length) {
      this.setCurrentCard();
      this.toggleExplanation = false;
    } else {
      this.toggleResults = true;
    }
  }

  private dataLoaded(deck: Deck): void {
    this.isLoading = false;
    this.deck = deck;
    this.setCurrentCard();
  }
}
