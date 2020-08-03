import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Card } from '../../quiz/card/card';
import { DeckService } from '../../services/deck.service';
import { Deck } from '../../quiz/deck/deck';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  cards: Card[];
  difficulties: any;
  isLoading = false;
  numberOfDefaultQuestions = 2;
  subjects: any;
  submitted = false;
  submittedDeck: Deck;

  collectionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    topic: new FormControl(''),
    subject: new FormControl('', Validators.required),
    questions: new FormArray([]),
    course: new FormControl(''),
    semester: new FormControl(''),
    difficulty: new FormControl('', Validators.required),
    allowSecondGuess: new FormControl(false, Validators.required),
    description: new FormControl(''),
    shareUrl: new FormControl(''),
    shareUrlActive: new FormControl(false, Validators.required),
    publicVisibility: new FormControl(false, Validators.required),
  });

  get isDataLoaded(): boolean {
    return this.cards !== undefined;
  }

  get form() {
    return this.collectionForm;
  }

  get shareUrlActive() {
    return this.form.get('shareUrlActive');
  }

  get publicVisibility() {
    return this.form.get('publicVisibility');
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  constructor(
    private deckService: DeckService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.getDifficulties();
    this.getMyCards();
    this.getSubjects();
    this.initFormQuestions();
  }

  addQuestion(): void {
    this.questions.push(new FormControl('', Validators.required));
  }

  selectQuestion(formIndex: number, questionId: string): void {
    this.questions.at(formIndex).get('id').patchValue(questionId);
  }

  getDifficulties(): void {
    this.deckService
      .getDifficulties()
      .subscribe((difficulties) => (this.difficulties = difficulties));
  }

  getMyCards(): void {
    this.deckService.getMyCards().subscribe((cards) => this.dataLoaded(cards));
  }

  getSubjects(): void {
    this.deckService
      .getSubjects()
      .subscribe((subjects) => (this.subjects = subjects));
    if (this.subjects) {
      this.sortSubjects();
    }
  }

  initFormQuestions(): void {
    for (let index = 0; index < this.numberOfDefaultQuestions; index++) {
      this.addQuestion();
    }
  }

  onSubmit(collectionForm: FormGroup): void {
    if (this.form.invalid) {
      const errorMessage = 'Die Angaben sind nicht vollständig.';
      this.snackBarService.open(errorMessage);
      return;
    }

    const questions = [];
    for (let i = 0; i < this.questions.length; i++) {
      questions.push(this.questions.at(i).value);
      console.log(this.questions.at(i).value);
    }

    this.submitted = true;
    const submittedDeck: Deck = {
      name: collectionForm.value.name,
      topic: collectionForm.value.topic,
      subject: collectionForm.value.subject.name,
      questions,
      course: collectionForm.value.course,
      semester: collectionForm.value.semester,
      difficulty: collectionForm.value.difficulty.level,
      allowSecondGuess: collectionForm.value.allowSecondGuess,
      description: collectionForm.value.description,
      shareUrl: collectionForm.value.shareUrl,
      shareUrlActive: collectionForm.value.shareUrlActive,
      publicVisibility: collectionForm.value.publicVisibility,
    };

    this.deckService.createDeck(submittedDeck).subscribe((data) => {
      const successMessage = 'Das Quiz wurde erfolgreich erstellt.';
      this.snackBarService.open(successMessage);
      this.resetForm();
    });
  }

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

  resetForm(): void {
    this.submitted = false;
    this.form.reset({
      name: '',
      topic: '',
      subject: '',
      course: '',
      semester: '',
      difficulty: '',
      description: '',
      allowSecondGuess: false,
      shareUrlActive: false,
      publicVisibility: false,
    });
    this.questions.clear();
    this.initFormQuestions();
  }

  setShareUrlActive(event: MatSlideToggleChange): void {
    const isShareUrlActive = event.checked;
    console.log(isShareUrlActive);
  }

  setPublicVisibility(event: MatSlideToggleChange): void {
    const isPubliclyVisible = event.checked;
    console.log(isPubliclyVisible);
  }

  setAllowSecondGuess(event: MatSlideToggleChange): void {
    const isAllowingSecondGuess = event.checked;
    console.log(isAllowingSecondGuess);
  }

  sortSubjects(): void {
    this.subjects.sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { ignorePunctuation: true })
    );
  }

  private dataLoaded(cards: Card[]): void {
    this.isLoading = false;
    this.cards = cards;
  }
}
