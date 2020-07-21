import { Card, Subject } from './../card/card';

export interface Deck {
  id: string;
  name: string;
  topic?: string;
  subject: Subject;
  author: string;
  course?: string;
  semester?: string;
  difficulty: Difficulty;
  description?: string;
  allowSecondGuess: boolean;
  questions?: Card[];
  shareUrl?: string;
  shareUrlActive: boolean;
  publicVisibility: boolean;
  owner: string;
  creationDate: Date;
  lastUpdatedDate: Date;
}

export interface Difficulty {
  level: string;
}
