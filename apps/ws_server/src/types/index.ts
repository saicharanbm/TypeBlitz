import { User } from "../User";

export enum wordDifficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}
export enum totalTime {
  fifteen = 15,
  thirty = 30,
  sixty = 60,
  onetwenty = 120,
}
export type TypingState = {
  // startTimestamp: number | null;
  // endTimestamp: number | null;
  letterDetails: LetterDetail[];
  correctLetterCount: number;
  errorCount: number;
};
export type LetterDetail = {
  type: LetterDetailType;
  timestamp: number;
  letter: string;
};
export enum LetterDetailType {
  correct = "correct",
  incorrect = "incorrect",
  next = "next",
  previous = "previous",
  extra = "extra",
  remove = "remove",
  removeExtra = "removeExtra",
}
export enum gameProgress {
  waiting = "waiting",
  starting = "starting",
  playing = "playing",
  finished = "finished",
}

export type roomDetails = {
  words: string[];
  startTime?: number | null;
  endTime?: number | null;
  difficulty: wordDifficulty;
  time: totalTime;
  users: User[];
  progress: gameProgress;
};
