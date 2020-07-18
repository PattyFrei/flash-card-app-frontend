import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { DeckService } from './../../deck.service';
import { Deck } from '../../deck/deck';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  numberOfDefaultQuestions = 5;
  submitted = false;
  formError = '';
  subjects: any;
  difficulties: any;
  submittedDeck: Deck;

  collectionForm = new FormGroup({
    name: new FormControl('', Validators.required),
    topic: new FormControl(''),
    subject: new FormControl('', Validators.required),
    questions: new FormArray([], Validators.required),
    course: new FormControl(''),
    semester: new FormControl(''),
    difficulty: new FormControl('', Validators.required),
    description: new FormControl(''),
    shareUrl: new FormControl(''),
    shareUrlActive: new FormControl(false, Validators.required),
    publicVisibility: new FormControl(false, Validators.required),
  });

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

  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.getDifficulties();
    this.getSubjects();
    this.initFormQuestions();
  }

  getDifficulties(): void {
    this.deckService
      .getDifficulties()
      .subscribe((difficulties) => (this.difficulties = difficulties));
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
      // addQuestion();
    }
  }

  onSubmit(collectionForm: FormGroup): void {}

  resetForm(): void {
    this.submitted = false;
    this.formError = '';
    this.form.reset({
      name: '',
      topic: '',
      subject: '',
      course: '',
      semester: '',
      difficulty: '',
      description: '',
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
    const isPublicVisible = event.checked;
    console.log(isPublicVisible);
  }

  sortSubjects(): void {
    this.subjects.sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { ignorePunctuation: true })
    );
  }
}
