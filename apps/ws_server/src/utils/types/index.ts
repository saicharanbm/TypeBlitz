import { User } from "../../User";

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

export enum gameProgress {
  waiting = "waiting",
  starting = "starting",
  playing = "playing",
  finished = "finished",
}

export type roomDetails = {
  words: string[];
  roomId: string;
  difficulty: wordDifficulty;
  time: totalTime;
  users: User[];
  progress: gameProgress;
};
