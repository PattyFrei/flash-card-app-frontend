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
  answerResultColor: string;
  currentCard: Card;
  currentCardIndex = 0;
  deck: Deck;
  explanationText: string;
  isLoading = false;
  questionTypeText: string;
  selectedAnswer: Answer;
  toggleCheck = false;
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

  onCheck(): void {
    if (this.selectedAnswer.correctAnswer) {
      this.answerResultColor = 'isCorrect';
      this.setExplanationText(true);
      this.totalCorrectAnswers++;
    } else {
      this.answerResultColor = 'isWrong';
      this.setExplanationText(false);
    }
    this.toggleNext = true;
    this.toggleCheck = false;
  }

  onNext(): void {
    if (this.currentCardIndex < this.deck.questions.length) {
      this.setCurrentCard();
      this.explanationText = '';
      this.answerResultColor = '';
    } else {
      this.toggleResults = true;
    }
  }

  onSelect(answer: Answer): void {
    this.selectedAnswer = answer;
    this.toggleCheck = true;
  }

  setCurrentCard(): void {
    this.toggleNext = false;
    this.currentCard = this.deck.questions[this.currentCardIndex];
    this.currentCardIndex++;
    this.setQuestionTypeText();
  }

  setExplanationText(result: boolean): void {
    if (result) {
      this.explanationText = 'Die Antwort ist richtig!';
    } else {
      // refactor with text from db
      this.explanationText = 'Leider ist die Antwort nicht richtig.';
    }
  }

  setQuestionTypeText(): void {
    if (this.currentCard.questionType === 'single-choice') {
      this.questionTypeText = 'Wählen Sie eine Antwort aus.';
    } else if (this.currentCard.questionType === 'multiple-choice') {
      this.questionTypeText =
        'Wählen Sie eine oder mehrere richtige Antworten aus.';
    } else {
      this.questionTypeText = 'Geben Sie eine Antwort ein.';
    }
  }

  private dataLoaded(deck: Deck): void {
    this.isLoading = false;
    this.deck = deck;
    this.setCurrentCard();
  }
}
