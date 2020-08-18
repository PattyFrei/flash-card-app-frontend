import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { MatRadioChange } from '@angular/material/radio';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Answer, Card, HTMLInputEvent } from '../../quiz/card/card';
import { DeckService } from '../../services/deck.service';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  card: Card;
  cardIsUpdating: boolean;
  existingImage: any;
  numberOfDefaultAnswers = 4;
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
    questionType: new FormControl('', Validators.required),
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
    private snackBarService: SnackBarService,
    private route: ActivatedRoute
  ) {}

  @ViewChild(MatAccordion) accordion: MatAccordion;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cardIsUpdating = true;
      this.getCard(id);
    } else {
      this.cardIsUpdating = false;
      this.initFormAnswers();
      this.questionType.patchValue('single-choice');
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

  addExistingAnswer(answer: Answer): void {
    const answerGroup = new FormGroup({
      correctAnswer: new FormControl(answer.correctAnswer),
      answerText: new FormControl(answer.answerText, Validators.required),
      explanationText: new FormControl(answer.explanationText),
    });
    this.answers.push(answerGroup);
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.existingImage = reader.result;
      },
      false
    );

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  getCard(id: string): void {
    this.deckService.getCard(id).subscribe((card) => {
      this.card = card;
      this.initUpdateForm();
    });
  }

  getImage(): void {
    this.deckService.getImage(this.form.value.image).subscribe((data) => {
      this.createImageFromBlob(data);
    });
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

  initFormAnswers(): void {
    for (let index = 0; index < this.numberOfDefaultAnswers; index++) {
      index <= 0 ? this.addAnswer(true) : this.addAnswer(false);
    }
  }

  initUpdateForm(): void {
    this.form.patchValue({
      name: this.card.name,
      topic: this.card.topic,
      subject: this.card.subject,
      questionText: this.card.questionText,
      questionType: this.card.questionType,
      explanationText: this.card.explanationText,
      image: this.card.image,
      srcCode: this.card.srcCode,
    });

    this.card.answers.forEach((answer) => this.addExistingAnswer(answer));
    this.selectedQuestionType = this.card.questionType;
    if (this.card.image) {
      this.selectedFileName = 'Ein Bild ist';
      this.getImage();
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
      name: 'Verschiedenes',
      subject: 'Verschiedenes',
      topic: questionForm.value.topic,
      questionText: questionForm.value.questionText,
      questionType: questionForm.value.questionType,
      answers: questionForm.value.answers,
      srcCode: questionForm.value.srcCode,
      image: questionForm.value.image.imageId
        ? questionForm.value.image.imageId
        : questionForm.value.image,
    };

    if (this.cardIsUpdating) {
      this.deckService
        .updateCard(this.card.id, submittedCard)
        .subscribe((data) => {
          const successMessage = 'Die Frage wurde erfolgreich aktualisiert!';
          this.snackBarService.open(successMessage);
          this.resetForm();
        });
    } else {
      this.deckService.createCard(submittedCard).subscribe((data) => {
        const successMessage = 'Die Frage wurde erfolgreich erstellt!';
        this.snackBarService.open(successMessage);
        this.resetForm();
      });
    }
  }

  patchAnswer(index: number, field: string, value: boolean): void {
    this.answers.at(index).get(field).patchValue(value);
  }

  removeAnswer(index: number): void {
    this.answers.removeAt(index);
    this.setDefaultCorrectAnswerForSingleChoice();
  }

  resetForm(): void {
    this.submitted = false;
    this.selectedFileName = '';
    this.form.reset({
      topic: '',
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
        this.patchAnswer(index, 'correctAnswer', false);
      }
      this.patchAnswer(selectedAnswerIndex, 'correctAnswer', true);
    } else if (this.selectedQuestionType === 'multiple-choice') {
      isCorrectAnswer
        ? this.patchAnswer(selectedAnswerIndex, 'correctAnswer', true)
        : this.patchAnswer(selectedAnswerIndex, 'correctAnswer', false);
    }
  }

  setDefaultCorrectAnswerForSingleChoice(): void {
    for (let index = 0; index < this.answers.length; index++) {
      index <= 0
        ? this.patchAnswer(index, 'correctAnswer', true)
        : this.patchAnswer(index, 'correctAnswer', false);
    }
  }

  uploadImage(event: HTMLInputEvent) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFileName = file.name;
      const formData = new FormData();
      formData.append('file', file);

      this.deckService.uploadFile(formData).subscribe((data) => {
        this.uploadedFileId = data;
        this.form.get('image').patchValue(this.uploadedFileId.imageId);
        this.getImage();
      });
    }
  }
}
