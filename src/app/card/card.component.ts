import { Component, OnInit, Input } from '@angular/core';
import { Card, Answer } from './card';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() card: Card;
  selectedAnswer: Answer;
  constructor() {}

  ngOnInit(): void {}

  onSelect(answer: Answer): void {
    this.selectedAnswer = answer;
  }
}
