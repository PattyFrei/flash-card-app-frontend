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
  formError = '';
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

  get form() {
    return this.questionForm;
  }

  get questionType() {
    return this.form.get('questionType');
  }

  get answers() {
    return this.form.get('answers') as FormArray;
  }

  constructor(private deckService: DeckService) {}

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
    this.getSubjects();
    this.initFormAnswers();
  }

  addAnswer(correctAnswer: boolean): void {
    const answerGroup = new FormGroup({
      correctAnswer: new FormControl(correctAnswer),
      answerText: new FormControl('', Validators.required),
      explanationText: new FormControl(''),
    });
    this.answers.push(answerGroup);
  }

  getNumberOfCorrectAnswers(): number {
    let numberOfCorrectAnswers = 0;
    for (let index = 0; index < this.answers.length; index++) {
      const isCorrectAnswer = this.answers.at(index).get('correctAnswer').value;
      if (isCorrectAnswer === true) {
        numberOfCorrectAnswers++;
      }
    }
    return numberOfCorrectAnswers;
  }

  getMultipleChoiceValidity(): boolean {
    const numberOfCorrectAnswers = this.getNumberOfCorrectAnswers();
    if (numberOfCorrectAnswers > 1) {
      return true;
    }
    return false;
  }

  getSingleChoiceValidity(): boolean {
    const numberOfCorrectAnswers = this.getNumberOfCorrectAnswers();
    if (numberOfCorrectAnswers === 1) {
      return true;
    }
    return false;
  }

  getSubjects(): void {
    this.deckService
      .getSubjects()
      .subscribe((subjects) => (this.subjects = subjects));
    if (this.subjects) {
      this.sortSubjects();
    }
  }

  initFormAnswers(): void {
    for (let index = 0; index < this.numberOfDefaultAnswers; index++) {
      index <= 0 ? this.addAnswer(true) : this.addAnswer(false);
    }
  }

  moveAnswer(
    toBeRemovedAtIndex: number,
    toBeInsertedAtIndex: number,
    answer: FormGroup
  ): void {
    this.answers.removeAt(toBeRemovedAtIndex);
    this.answers.insert(toBeInsertedAtIndex, answer);
  }

  onSelectedQuestionTypeChange(event: MatRadioChange): void {
    this.selectedQuestionType = event.value;
    if (this.selectedQuestionType === 'singleChoice') {
      this.setDefaultCorrectAnswerForSingleChoice();
    }
  }

  onSubmit(questionForm: FormGroup): void {
    if (this.form.invalid) {
      this.formError = 'Die Angaben sind nicht vollständig.';
      return;
    } else if (this.questionType.value === 'singleChoice') {
      const isSingleChoiceValid = this.getSingleChoiceValidity();
      if (isSingleChoiceValid === false) {
        this.formError = 'Markiere eine richtige Antwort.';
        return;
      }
    } else {
      const isMultipleChoiceValid = this.getMultipleChoiceValidity();
      if (isMultipleChoiceValid === false) {
        this.formError = 'Markiere mindestens zwei richtige Antworten.';
        return;
      }
    }

    this.submitted = true;
    this.formError = '';
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
    console.log(submittedCard);

    // this.deckService.createCard(submittedCard).subscribe((data) => {
    //   console.log(data);
    //   // redirect to get questions
    // });
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
  }

  resetForm(): void {
    this.submitted = false;
    this.formError = '';
    this.form.reset({
      name: '',
      topic: '',
      subject: '',
      questionText: '',
      questionType: 'singleChoice',
      explanationText: '',
      image: '',
      srcCode: '',
    });
    this.answers.clear();
    this.initFormAnswers();
  }

  setCorrectAnswerValue(event: MatSlideToggleChange): void {
    const selectedAnswerIndex = parseInt(event.source.id, 10);
    const isCorrectAnswer = event.checked;

    if (this.selectedQuestionType === 'singleChoice') {
      for (let index = 0; index < this.answers.length; index++) {
        // console.log(index);
        this.answers.at(index).get('correctAnswer').patchValue(false);
      }
      this.answers
        .at(selectedAnswerIndex)
        .get('correctAnswer')
        .patchValue(true);
    } else if (this.selectedQuestionType === 'multipleChoice') {
      isCorrectAnswer
        ? this.answers
            .at(selectedAnswerIndex)
            .get('correctAnswer')
            .patchValue(true)
        : this.answers
            .at(selectedAnswerIndex)
            .get('correctAnswer')
            .patchValue(false);
    }
  }

  setDefaultCorrectAnswerForSingleChoice(): void {
    for (let index = 0; index < this.answers.length; index++) {
      index <= 0
        ? this.answers.at(index).get('correctAnswer').patchValue(true)
        : this.answers.at(index).get('correctAnswer').patchValue(false);
    }
  }

  sortSubjects(): void {
    this.subjects.sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { ignorePunctuation: true })
    );
  }
}
