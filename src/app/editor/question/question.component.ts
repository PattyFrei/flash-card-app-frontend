import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { DeckService } from '../../services/deck.service';
import { Card, HTMLInputEvent } from '../../card/card';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  numberOfDefaultAnswers = 4;
  subjects: any;
  selectedQuestionType = 'single-choice';
  submitted = false;
  submittedCard: Card;
  selectedFileName: string;
  uploadedFileId: any;

  questionForm = new FormGroup({
    name: new FormControl(''),
    topic: new FormControl(''),
    subject: new FormControl(''),
    questionText: new FormControl('', Validators.required),
    questionType: new FormControl('single-choice', Validators.required),
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

  constructor(
    private deckService: DeckService,
    private snackBarService: SnackBarService
  ) {}

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

  uploadImage(event: HTMLInputEvent) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;
      const formData = new FormData();
      formData.append('file', file);

      this.deckService.uploadFile(formData).subscribe((data) => {
        this.uploadedFileId = data;
        this.form.get('image').patchValue(data);
      });
    }
  }

  onSelectedQuestionTypeChange(event: MatRadioChange): void {
    this.selectedQuestionType = event.value;
    if (this.selectedQuestionType === 'single-choice') {
      this.setDefaultCorrectAnswerForSingleChoice();
    }
  }

  onSubmit(questionForm: FormGroup): void {
    if (this.form.invalid) {
      const errorMessage = 'Die Angaben sind nicht vollständig.';
      this.snackBarService.open(errorMessage);
      return;
    } else if (this.questionType.value === 'single-choice') {
      const isSingleChoiceValid = this.getSingleChoiceValidity();
      if (isSingleChoiceValid === false) {
        const errorMessage = 'Markiere eine richtige Antwort.';
        this.snackBarService.open(errorMessage);
        return;
      }
    } else {
      const isMultipleChoiceValid = this.getMultipleChoiceValidity();
      if (isMultipleChoiceValid === false) {
        const errorMessage = 'Markiere mindestens zwei richtige Antworten.';
        this.snackBarService.open(errorMessage);
        return;
      }
    }

    this.submitted = true;
    const submittedCard: Card = {
      name: 'namePlaceholder',
      subject: 'Verschiedenens',
      topic: questionForm.value.topic,
      questionText: questionForm.value.questionText,
      questionType: questionForm.value.questionType,
      answers: questionForm.value.answers,
      srcCode: questionForm.value.srcCode,
      image: questionForm.value.image.imageId,
    };

    this.deckService.createCard(submittedCard).subscribe((data) => {
      const successMessage = 'Die Frage wurde erfolgreich erstellt!';
      this.snackBarService.open(successMessage);
      this.resetForm();
    });
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
    this.setDefaultCorrectAnswerForSingleChoice();
  }

  resetForm(): void {
    this.submitted = false;
    this.selectedFileName = '';
    this.form.reset({
      // name: '',
      // topic: '',
      // subject: '',
      questionText: '',
      questionType: 'single-choice',
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

    if (this.selectedQuestionType === 'single-choice') {
      for (let index = 0; index < this.answers.length; index++) {
        this.answers.at(index).get('correctAnswer').patchValue(false);
      }
      this.answers
        .at(selectedAnswerIndex)
        .get('correctAnswer')
        .patchValue(true);
    } else if (this.selectedQuestionType === 'multiple-choice') {
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
