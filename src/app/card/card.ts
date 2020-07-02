export interface Card {
  id: string;
  name: string;
  topic?: string;
  subject: Subject;
  questionText: string;
  questionType: string;
  answers: Answer[];
  explanationText?: string;
  image?: string;
  srcCode?: string;
  // owner: User;
  creationDate: Date;
  lastUpdatedDate: Date;
  hasSiblings?: Card[];
  // [propName: string]: any; // for any other props
}

export interface Answer {
  correctAnswer: boolean;
  answerText: string;
  explanationText?: string;
}

export interface Subject {
  subjects: string[];
}
