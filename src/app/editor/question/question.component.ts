import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { DeckService } from './../../deck.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent implements OnInit {
  subjects: any;
  selectedSubject: string;

  questionForm = new FormGroup({
    name: new FormControl(''),
    topic: new FormControl(''),
    subject: new FormControl(''),
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

  submit(): void {}
}
