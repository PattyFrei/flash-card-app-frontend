import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

import { Card, Subject } from '../../quiz/card/card';
import { DeckService } from '../../services/deck.service';
import { Deck, Difficulty } from '../../quiz/deck/deck';
import { SnackBarService } from '../../services/snack-bar.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
})
export class CatalogueComponent implements OnInit {
  cards: Card[];
  deck: Deck;
  deckIsUpdating = false;
  difficulties: any;
  numberOfDefaultQuestions = 2;
  selectedDifficulty: Difficulty;
  selectedSubject: Subject;
  subjects: any;
  submitted = false;
  submittedDeck: Deck;

  catalogueForm = new FormGroup({
    name: new FormControl('', Validators.required),
    topic: new FormControl(''),
    subject: new FormControl('', Validators.required),
    questions: new FormArray([]),
    course: new FormControl(''),
    semester: new FormControl(''),
    difficulty: new FormControl('', Validators.required),
    allowSecondGuess: new FormControl('', Validators.required),
    description: new FormControl(''),
    shareUrl: new FormControl(''),
    shareUrlActive: new FormControl('', Validators.required),
    publicVisibility: new FormControl('', Validators.required),
  });

  get form() {
    return this.catalogueForm;
  }

  get shareUrlActive() {
    return this.form.get('shareUrlActive');
  }

  get publicVisibility() {
    return this.form.get('publicVisibility').value;
  }

  get subject() {
    return this.form.get('subject').value;
  }

  get questions() {
    return this.form.get('questions') as FormArray;
  }

  constructor(
    private deckService: DeckService,
    private snackBarService: SnackBarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getDifficulties();
    this.getSubjects();
    this.getMyCards();
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.deckIsUpdating = true;
      this.getDeck(id);
    } else {
      this.initFormQuestions();
      this.form.patchValue({
        allowSecondGuess: false,
        publicVisibility: false,
        shareUrlActive: false,
      });
    }
  }

  addQuestion(): void {
    const questionsGroup = new FormGroup({
      id: new FormControl('', Validators.required),
    });
    this.questions.push(questionsGroup);
  }

  addExistingQuestion(card: Card): void {
    const questionsGroup = new FormGroup({
      id: new FormControl(card.id, Validators.required),
    });
    this.questions.push(questionsGroup);
  }

  getDeck(id: string): void {
    this.deckService.getDeck(id).subscribe((deck) => {
      this.deck = deck;
      this.initUpdateForm();
    });
  }

  getDifficulties(): void {
    this.deckService
      .getDifficulties()
      .subscribe((difficulties) => (this.difficulties = difficulties));
  }

  getMyCards(): void {
    this.deckService.getMyCards().subscribe((cards) => {
      this.cards = cards;
      this.sortCards();
    });
  }

  getSubjects(): void {
    this.deckService.getSubjects().subscribe((subjects) => {
      this.subjects = subjects;
      this.sortSubjects();
    });
  }

  initFormQuestions(): void {
    for (let index = 0; index < this.numberOfDefaultQuestions; index++) {
      this.addQuestion();
    }
  }

  initUpdateForm(): void {
    this.form.patchValue({
      name: this.deck.name,
      topic: this.deck.topic,
      subject: this.deck.subject,
      course: this.deck.course,
      semester: this.deck.semester,
      difficulty: this.deck.difficulty,
      allowSecondGuess: this.deck.allowSecondGuess,
      description: this.deck.description,
      shareUrl: this.deck.shareUrl,
      shareUrlActive: this.deck.shareUrlActive,
      publicVisibility: this.deck.publicVisibility,
    });

    this.deck.questions.forEach((question) =>
      this.addExistingQuestion(question)
    );
    this.selectedSubject = this.deck.subject;
    this.selectedDifficulty = this.deck.difficulty;
  }

  onSubmit(catalogueForm: FormGroup): void {
    if (this.form.invalid) {
      const errorMessage = 'Die Angaben sind nicht vollständig.';
      this.snackBarService.open(errorMessage);
      return;
    } else if (this.publicVisibility === true) {
      if (this.questions.length < 5) {
        const errorMessage =
          'Öffentliche Kataloge benötigen mindestens 5 Fragen.';
        this.snackBarService.open(errorMessage);
        return;
      }
      if (!this.form.get('topic').value) {
        const errorMessage = 'Öffentliche Kataloge benötigen ein Thema.';
        this.snackBarService.open(errorMessage);
        return;
      }
    }

    const questions = [];
    for (let i = 0; i < this.questions.length; i++) {
      questions.push(this.questions.at(i).get('id').value);
    }

    this.submitted = true;
    const submittedDeck: Deck = {
      name: catalogueForm.value.name,
      topic: catalogueForm.value.topic,
      subject: catalogueForm.value.subject,
      questions,
      course: catalogueForm.value.course,
      semester: catalogueForm.value.semester,
      difficulty: catalogueForm.value.difficulty,
      allowSecondGuess: catalogueForm.value.allowSecondGuess,
      description: catalogueForm.value.description,
      shareUrl: catalogueForm.value.shareUrl,
      shareUrlActive: catalogueForm.value.shareUrlActive,
      publicVisibility: catalogueForm.value.publicVisibility,
    };

    if (this.deckIsUpdating) {
      this.deckService
        .updateDeck(this.deck.id, submittedDeck)
        .subscribe((data) => {
          const successMessage = 'Die Frage wurde erfolgreich aktualisiert!';
          this.snackBarService.open(successMessage);
          this.resetForm();
        });
    } else {
      this.deckService.createDeck(submittedDeck).subscribe((data) => {
        const successMessage = 'Das Quiz wurde erfolgreich erstellt.';
        this.snackBarService.open(successMessage);
        this.resetForm();
      });
    }
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

  sortSubjects(): void {
    this.subjects.sort((a, b) =>
      a.name.localeCompare(b.name, 'de', { ignorePunctuation: true })
    );
  }

  sortCards(): void {
    this.cards.sort((a, b) =>
      a.topic.localeCompare(b.topic, 'de', { ignorePunctuation: true })
    );
  }
}
