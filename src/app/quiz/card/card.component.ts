import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';

import { Card, Answer } from './card';
import { Deck } from './../deck/deck';
import { DeckService } from './../../services/deck.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  correctAnswersInPercent: number;
  correctAnswerScore = 0;
  currentCard: Card;
  currentCardIndex = 0;
  currentCardImage: any;
  deck: Deck;
  explanationText: string;
  isImageLoading = false;
  isMultipleChoiceCorrect = false;
  isLoading = false;
  isDisabled = false;
  progressBarValue: number;
  questionTypeText: string;
  resultBadge: string;
  resultMessage: string;
  selectedAnswer: Answer;
  selectedAnswers: Answer[] = [];
  toggleCheck = false;
  toggleResults = false;
  toggleNext = false;

  get isDataLoaded(): boolean {
    return this.deck !== undefined && this.toggleResults === false;
  }

  get isQuizCompleted(): boolean {
    return this.toggleResults === true;
  }

  constructor(private deckService: DeckService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    this.deckService.getDeck(id).subscribe((deck) => this.dataLoaded(deck));
  }

  calculateProgressBarValue(): void {
    if (this.deck.questions.length >= 10) {
      this.progressBarValue = this.currentCardIndex * 10;
    } else if (this.deck.questions.length >= 2) {
      const progressBarRangeInDecimal = this.deck.questions.length / 10;
      this.progressBarValue = (this.currentCardIndex / progressBarRangeInDecimal) * 10;
    } else {
      this.progressBarValue = 100;
    }
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.currentCardImage = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  knuthShuffleAnswers(answers: Array<Answer>): void {
    let currentIndex = answers.length;
    let temporaryAnswer: Answer;
    let randomIndex: number;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryAnswer = answers[currentIndex];
      answers[currentIndex] = answers[randomIndex];
      answers[randomIndex] = temporaryAnswer;
    }
  }

  getImage(): void {
    if (this.currentCard.image) {
      this.isImageLoading = true;
      this.deckService.getImage(this.currentCard.image).subscribe((data) => {
        this.createImageFromBlob(data);
      });
      this.isImageLoading = false;
    }
  }

  onRadioChange(answer: Answer): void {
    this.selectedAnswer = answer;
    this.toggleCheck = true;
  }

  onCheckBoxChange(event: MatCheckboxChange, answer: Answer): void {
    if (event.checked) {
      this.selectedAnswers.push(answer);
      this.toggleCheck = true;
    } else {
      const answerIndex = this.selectedAnswers.indexOf(answer);
      if (answerIndex >= 0) {
        this.selectedAnswers.splice(answerIndex, 1);
      }
      this.selectedAnswers.length >= 1 ? (this.toggleCheck = true) : (this.toggleCheck = false);
    }
  }

  onCheck(): void {
    if (this.currentCard.questionType === 'multiple-choice') {
      this.setCorrectMultipleChoiceAnswerText();
    } else {
      if (this.selectedAnswer.correctAnswer) {
        this.setExplanationText(true);
        this.correctAnswerScore++;
      } else {
        this.setExplanationText(false);
      }
    }
    this.isDisabled = true;
    this.toggleNext = true;
    this.toggleCheck = false;
  }

  onNext(): void {
    if (this.currentCardIndex < this.deck.questions.length) {
      this.setCurrentCard();
      this.selectedAnswers = [];
      this.explanationText = '';
      this.isDisabled = false;
    } else {
      this.setCorrectAnswersInPercent();
      this.setResult();
      this.toggleResults = true;
    }
  }

  setCorrectAnswersInPercent(): void {
    const rawPercent = (this.correctAnswerScore * 100) / this.deck.questions.length;
    this.correctAnswersInPercent = Math.round(rawPercent);
  }

  setCurrentCard(): void {
    this.toggleNext = false;
    this.currentCard = this.deck.questions[this.currentCardIndex];
    this.knuthShuffleAnswers(this.currentCard.answers);
    this.currentCardIndex++;
    this.setQuestionTypeText();
    this.calculateProgressBarValue();
    this.getImage();
  }

  setExplanationText(result: boolean): void {
    if (result) {
      this.explanationText = 'Die Antwort ist richtig!';
    } else {
      this.explanationText = 'Leider ist die Antwort nicht richtig.';
    }
  }

  setQuestionTypeText(): void {
    if (this.currentCard.questionType === 'single-choice') {
      this.questionTypeText = 'Wähle eine Antwort aus:';
    } else if (this.currentCard.questionType === 'multiple-choice') {
      this.questionTypeText = 'Wähle mehrere richtige Antworten aus:';
    } else {
      this.questionTypeText = 'Gebe eine Antwort ein:';
    }
  }

  setCorrectMultipleChoiceAnswerText(): string {
    let totalCorrectAnswers = 0;
    this.currentCard.answers.forEach((element) => {
      if (element.correctAnswer === true) {
        totalCorrectAnswers++;
      }
    });

    let selectedCorrectAnswers = 0;
    this.selectedAnswers.forEach((element) => {
      if (element.correctAnswer === true) {
        selectedCorrectAnswers++;
      }
    });

    if (totalCorrectAnswers === selectedCorrectAnswers) {
      this.correctAnswerScore++;
      this.isMultipleChoiceCorrect = true;
      return (this.explanationText = 'Die ausgewählten Antworten ist richtig!');
    } else {
      this.isMultipleChoiceCorrect = false;
      return (this.explanationText =
        'Nur ' +
        selectedCorrectAnswers +
        ' der ausgewählte Antwort(en) ist/sind richtig. Es gibt insgesamt ' +
        totalCorrectAnswers +
        ' richtige Antworten.');
    }
  }

  setResult(): void {
    if (this.correctAnswersInPercent === 100) {
      this.resultMessage = 'Herzlichen Glückwunsch, du hast das Quiz gemeistert!';
      this.resultBadge = '087-winner.svg';
    } else if (this.correctAnswersInPercent <= 99 && this.correctAnswersInPercent >= 90) {
      this.resultMessage = 'Herzlichen Glückwunsch, du hast ein sehr gutes Ergebnis erreicht!';
      this.resultBadge = '059-gold_medal.svg';
    } else if (this.correctAnswersInPercent <= 89 && this.correctAnswersInPercent >= 75) {
      this.resultMessage = 'Herzlichen Glückwunsch, du hast ein gutes Ergebnis erreicht!';
      this.resultBadge = '054-silver_medal.svg';
    } else if (this.correctAnswersInPercent <= 74 && this.correctAnswersInPercent >= 60) {
      this.resultMessage = 'Du hast ein durschnittliches Ergebnis erreicht.';
      this.resultBadge = '055-bronze_medal.svg';
    } else if (this.correctAnswersInPercent <= 59 && this.correctAnswersInPercent >= 50) {
      this.resultMessage = 'Du kannst das Quiz noch einmal wiederholen, wenn du möchtest.';
      this.resultBadge = '065-emblem.svg';
    } else {
      this.resultMessage = 'Du kannst das Quiz noch einmal wiederholen, wenn du möchtest.';
      this.resultBadge = '057-emblem.svg';
    }
  }

  private dataLoaded(deck: Deck): void {
    this.isLoading = false;
    this.deck = deck;
    this.setCurrentCard();
  }
}
