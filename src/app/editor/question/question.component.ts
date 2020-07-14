import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { DeckService } from './../../deck.service';
import { Card } from 'src/app/card/card';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  numberOfDefaultAnswers = 4;
  subjects: any;
  selectedQuestionType = 'singleChoice';
  submitted = false;
  submittedCard: Card;

  questionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    topic: new FormControl(''),
    subject: new FormControl('', Validators.required),
    questionText: new FormControl('', Validators.required),
    questionType: new FormControl('singleChoice', Validators.required),
    answers: new FormArray([], Validators.required),
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
    for (let index = 0; index < this.numberOfDefaultAnswers; index++) {
      index <= 0 ? this.addAnswer(true) : this.addAnswer(false);
    }
  }

  addAnswer(correctAnswer: boolean): void {
    const answerGroup = new FormGroup({
      correctAnswer: new FormControl(correctAnswer),
      answerText: new FormControl('', Validators.required),
      explanationText: new FormControl(''),
    });
    this.answers.push(answerGroup);
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
    // remove correctAnswer flag if has one, select 1st answer
  }

  moveAnswer(
    toBeRemovedAtIndex: number,
    toBeInsertedAtIndex: number,
    answer: FormGroup
  ): void {
    this.answers.removeAt(toBeRemovedAtIndex);
    this.answers.insert(toBeInsertedAtIndex, answer);
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

  resetForm(): void {
    this.submitted = false;
    this.answers.clear();
    for (let index = 0; index < this.numberOfDefaultAnswers; index++) {
      index <= 0 ? this.addAnswer(true) : this.addAnswer(false);
    }
  }

  onSelectedQuestionTypeChange(event: MatRadioChange): void {
    this.selectedQuestionType = event.value;
    console.log(this.selectedQuestionType);
  }

  onCorrectAnswerChange(event: MatSlideToggleChange): void {
    const selectedAnswer = parseInt(event.source.id, 10);
    const isCorrectAnswer = event.checked;

    // console.log(selectedAnswer, isCorrectAnswer);
    // console.log(this.selectedQuestionType);
    // console.log('nbr of answers:', this.answers.length);

    if (this.selectedQuestionType === 'singleChoice') {
      for (let index = 0; index < this.answers.length; index++) {
        // console.log(index);
        this.answers.at(index).get('correctAnswer').patchValue(false);
      }
      this.answers.at(selectedAnswer).get('correctAnswer').patchValue(true);
    } else {
      isCorrectAnswer
        ? this.answers.at(selectedAnswer).get('correctAnswer').patchValue(true)
        : this.answers
            .at(selectedAnswer)
            .get('correctAnswer')
            .patchValue(false);
    }
  }

  onSubmit(questionForm: FormGroup): void {
    this.submitted = true;
    // check if single-choice and multiple-choice selection is valid
    if (this.questionForm.invalid) {
      console.log('submit denied');
      return;
    } else {
      console.log(questionForm);

      const submittedCard: Card = {
        name: questionForm.value.name,
        subject: questionForm.value.subject.name,
        topic: questionForm.value.topic,
        questionText: questionForm.value.questionText,
        questionType: questionForm.value.questionType,
        answers: questionForm.value.answers,
        srcCode: questionForm.value.srcCode,
        image: questionForm.value.image,
        owner: 'Dummy',
      };

      this.deckService.createCard(submittedCard).subscribe((data) => {
        console.log(data);
        // redirect to get questions
      });
    }
  }
}
