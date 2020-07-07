import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';

import { DeckService } from './../../deck.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  numberOfDefaultAnswers = 4;
  subjects: any;
  selectedQuestionType: 'singleChoice';

  questionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    topic: new FormControl(''),
    subject: new FormControl('', Validators.required),
    questionText: new FormControl('', Validators.required),
    questionType: new FormControl('singleChoice', Validators.required),
    answers: new FormArray(
      [
        new FormGroup({
          correctAnswer: new FormControl(''),
          answerText: new FormControl(''),
          explanationText: new FormControl(''),
        }),
      ],
      Validators.required
    ),
    explanationText: new FormControl(''),
    image: new FormControl(''),
    srcCode: new FormControl(''),
  });

  get answers() {
    return this.questionForm.get('answers') as FormArray;
  }

  constructor(private deckService: DeckService) {}

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
    this.getSubjects();
    for (let index = 1; index < this.numberOfDefaultAnswers; index++) {
      this.addAnswer();
    }
  }

  addAnswer(): void {
    const answerGroup = new FormGroup({
      correctAnswer: new FormControl(''),
      answerText: new FormControl(''),
      explanationText: new FormControl(''),
    });

    this.answers.push(answerGroup);
  }

  getSubjects(): void {
    this.deckService
      .getSubjects()
      .subscribe((subjects) => (this.subjects = subjects));
    if (this.subjects) {
      this.sortSubjects();
    }
  }

  sortSubjects(): void {
    this.subjects.sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { ignorePunctuation: true })
    );
  }

  onChange(event: any): void {
    this.selectedQuestionType = event.value;
    console.log(this.selectedQuestionType);
  }

  onSubmit(questionForm: FormGroup): void {}
}
