export interface GameState {
  words: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  gameStatus: "waiting" | "playing" | "finished";
  timeLeft: number;
  wpm: number;
}
