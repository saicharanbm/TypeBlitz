export interface GameState {
  words: LetterInfo[][];
  originalWords: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  gameStatus: "waiting" | "playing" | "finished";
  timeLeft: number;
  focus: boolean;
  wpm: number;
}

export interface LetterInfo {
  letter: string;
  type: letterType;
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

export type HomeProps = {
  userId: string;
  wsConnection: WebSocket;
};
export type roomDetailsType = {
  roomId: string;
  users: Users[];
};
export type Users = {
  userId: string;
  name: string;
  isAdmin: boolean;
};
