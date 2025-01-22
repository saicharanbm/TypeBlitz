export interface GameState {
  words: LetterInfo[][];
  originalWords: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  gameStatus: "waiting" | "playing" | "finished";
  timeLeft: number;
  wpm: number;
}

export interface LetterInfo {
  letter: string;
  type: letterType;
}

export enum letterType {
  correct = "text-correct",
  incorrect = "text-incorrect",
  normal = "",
}
