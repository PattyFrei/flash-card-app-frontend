export interface Card {
  id: string;
  question: string;
  questionType: string;
  answers: Answer[];
  // [propName: string]: any; // for any other props
}

export interface Answer {
  correctAnswer: boolean;
  text: string;
}
