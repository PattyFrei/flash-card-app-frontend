import { Card } from './../card/card';

export interface Deck {
  id: string;
  name: string;
  topic: string;
  course: string;
  author: string;
  questions: Card[];
}
