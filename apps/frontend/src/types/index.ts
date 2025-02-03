export type GameState = {
  words: LetterInfo[][];
  originalWords: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  gameStatus: "waiting" | "playing" | "finished";
  timeLeft: number;
  focus: boolean;
};

export interface LetterInfo {
  letter: string;
  type: letterType;
}
export type TypingState = {
  startTimestamp: number | null;
  endTimestamp: number | null;
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

export enum letterType {
  correct = "text-correct",
  incorrect = "text-incorrect",
  extra = "text-incorrectExtra",
  normal = "",
}

export enum wsStatus {
  connected = "connected",
  loading = "loading",
  error = "error",
}

export type PopupProps = {
  setIsPopupOpen: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  wsConnection: WebSocket;
};

export type ConnectionErrorProps = {
  reloadCount: number;
  setReloadCount: React.Dispatch<React.SetStateAction<number>>;
};

export type HomeProps = {
  userId: string;
  wsConnection: WebSocket;
};
export type roomDetailsType = {
  difficulty: wordDifficulty;
  time: totalTime;
  roomId: string;
  users: Users[];
  messages: Message[];
  progress: gameProgress;
};
export type Users = {
  userId: string;
  name: string;
  isAdmin: boolean;
};
export type Message = {
  name: string;
  id: string;
  message: string;
  type: messageType;
};
export enum messageType {
  message = "message",
  update = "update",
}
export enum totalTime {
  fifteen = 15,
  thirty = 30,
  sixty = 60,
  onetwenty = 120,
}
// export type gameDetails = {
//   difficulty: wordDifficulty;
//   time: totalTime;
// };

export type firstUserPayload = {
  userId: string;
  roomId: string;
  name: string;
  isAdmin: boolean;
  difficulty: wordDifficulty;
  progress: gameProgress;
  time: totalTime;
};

export enum gameProgress {
  waiting = "waiting",
  starting = "starting",
  playing = "playing",
  finished = "finished",
}
export interface updateUserPayload {
  name: string;
  userId: string;
  isAdmin: boolean;
}
export enum wordDifficulty {
  easy = "easy",
  medium = "medium",
  hard = "hard",
}
