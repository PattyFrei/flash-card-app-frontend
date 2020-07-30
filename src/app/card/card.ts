import { User } from './../deck/deck';

export interface Card {
  id?: string;
  name: string;
  topic?: string;
  subject: Subject;
  questionText: string;
  questionType: string; // single-choice | multiple-choice
  answers: Answer[];
  explanationText?: string;
  image?: string; // imageId
  srcCode?: string; // srcCodeUrl
  owner?: User;
  creationDate?: Date;
  lastUpdatedDate?: Date;
  hasSiblings?: Card[]; // siblings
  // [propName: string]: any; // for any other props
}

export interface Answer {
  correctAnswer: boolean; // isCorrectAnswer
  answerText: string;
  explanationText?: string;
}

export interface Subject {
  name: string;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
