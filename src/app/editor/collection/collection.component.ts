import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { AuthService } from '../../auth.service';
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

  get profile() {
    return this.auth.userProfile$ as any;
  }

  get userId() {
    return this.profile.source.value.sub;
  }

  get userNickname() {
    return this.profile.source.value.nickname;
  }

  constructor(public auth: AuthService, private deckService: DeckService) {}

  ngOnInit(): void {
    this.getDifficulties();
    this.getSubjects();
    this.initFormQuestions();
  }

  // addQuestion(): void {
  //   const questionGroup = new FormGroup({
  //     questionId: new FormControl(''),
  //   });
  //   this.questions.push(questionGroup);
  // }

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
      // this.addQuestion();
    }
  }

  onSubmit(collectionForm: FormGroup): void {
    if (this.form.invalid) {
      this.formError = 'Die Angaben sind nicht vollständig.';
      return;
    }

    const owner = {
      id: this.userId,
      displayName: this.userNickname,
    };

    this.submitted = true;
    this.formError = '';
    const submittedDeck: Deck = {
      name: collectionForm.value.name,
      topic: collectionForm.value.topic,
      subject: collectionForm.value.subject.name,
      questions: collectionForm.value.questions,
      course: collectionForm.value.course,
      semester: collectionForm.value.semester,
      difficulty: collectionForm.value.difficulty.level,
      allowSecondGuess: collectionForm.value.allowSecondGuess,
      description: collectionForm.value.description,
      shareUrl: collectionForm.value.shareUrl,
      shareUrlActive: collectionForm.value.shareUrlActive,
      publicVisibility: collectionForm.value.publicVisibility,
      owner,
    };

    console.log(submittedDeck);

    this.deckService.createDeck(submittedDeck).subscribe((data) => {
      console.log(data);
      // redirect to get questions
    });
  }

  setUserId(): void {}

  removeQuestion(index: number): void {
    this.questions.removeAt(index);
  }

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
}
