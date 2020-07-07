import { Component, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';

import { DeckService } from './../../deck.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  subjects: any;
  selectedQuestionType: 'singleChoice';

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
  constructor(private deckService: DeckService) {}

  ngOnInit(): void {
    this.getSubjects();
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
