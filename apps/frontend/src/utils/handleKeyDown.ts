import { scrollUpOneLine } from ".";
import { GameState, LetterDetailType, letterType, TypingState } from "../types";
import { MutableRefObject, Dispatch, SetStateAction } from "react";

export const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  gameState: GameState,
  charsPerLine: number,
  GAME_TIME: number,
  setGameState: Dispatch<SetStateAction<GameState | undefined>>,
  gameRef: React.RefObject<HTMLDivElement>,
  setLineOffset: Dispatch<React.SetStateAction<number>>,
  focusLetterCount: MutableRefObject<number>,
  setTypingState?: Dispatch<SetStateAction<TypingState>>,
  typingState?: TypingState,
  wsConnection?: WebSocket
): void => {
  if (gameState.gameStatus === "finished") return;

  const { key } = event;
  const isLetter = key.length === 1 && key !== " ";
  const isSpace = key === " ";
  const isBackspace = key === "Backspace";

  if (focusLetterCount.current > charsPerLine)
    scrollUpOneLine(gameRef, setLineOffset, focusLetterCount);

  if (gameState.gameStatus === "waiting" && isLetter) {
    setGameState((prev) => {
      if (!prev) return;
      return {
        ...prev,
        gameStatus: "playing",
        startTimestamp: Date.now(),
        endTimestamp: Date.now() + GAME_TIME * 1000,
      };
    });
    if (setTypingState)
      setTypingState((prev) => ({
        ...prev,
        startTimestamp: Date.now(),
        endTimestamp: Date.now() + GAME_TIME * 1000,
        letterDetails: [],
      }));
  }
  if (wsConnection) {
    //send the request
  }
  // if (!typingState.startTimestamp && !typingState.endTimestamp) return;

  const currentWord = gameState.words[gameState.currentWordIndex];
  if (!currentWord) return;

  const timestamp = typingState?.startTimestamp
    ? Date.now() - typingState?.startTimestamp
    : 1;

  if (isLetter) {
    const currentLetter = currentWord[gameState.currentLetterIndex];
    let type: LetterDetailType = LetterDetailType.correct;

    if (!currentLetter) {
      currentWord.push({ letter: key, type: letterType.extra });
      type = LetterDetailType.extra;
    } else if (currentLetter.letter === key) {
      currentLetter.type = letterType.correct;
    } else {
      currentLetter.type = letterType.incorrect;
      type = LetterDetailType.incorrect;
    }
    focusLetterCount.current += 1;
    //update the typed key details
    if (setTypingState)
      setTypingState((prev) => ({
        ...prev,
        letterDetails: [
          ...prev.letterDetails,
          {
            letter: key,
            type,
            timestamp,
          },
        ],
        correctLetterCount:
          type === LetterDetailType.correct
            ? prev.correctLetterCount + 1
            : prev.correctLetterCount,
        errorCount:
          type !== LetterDetailType.correct
            ? prev.errorCount + 1
            : prev.errorCount,
      }));

    //update words with its currosponding classes and update the current letter index
    setGameState((prev) => {
      if (!prev) return;
      const updatedWords = [...prev.words];
      updatedWords[prev.currentWordIndex] = currentWord;
      return {
        ...prev,
        words: updatedWords,
        currentLetterIndex: prev.currentLetterIndex + 1,
      };
    });
    return;
  }

  if (isSpace) {
    focusLetterCount.current += 1;
    if (
      gameState.currentLetterIndex >=
      gameState.words[gameState.currentWordIndex].length
    ) {
      //update the typed key details
      if (setTypingState)
        setTypingState((prev) => ({
          ...prev,
          letterDetails: [
            ...prev.letterDetails,
            {
              letter: "Space",
              type: LetterDetailType.next,
              timestamp,
            },
          ],
          correctLetterCount: prev.correctLetterCount + 1,
        }));
      setGameState((prev) => {
        if (!prev) return;
        return {
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          currentLetterIndex: 0,
        };
      });
      return;
    }
    const currentLetter = currentWord[gameState.currentLetterIndex];
    currentLetter.type = letterType.incorrect;
    //update the typed key details
    if (setTypingState)
      setTypingState((prev) => ({
        ...prev,
        letterDetails: [
          ...prev.letterDetails,
          {
            letter: "Space",
            type: LetterDetailType.incorrect,
            timestamp,
          },
        ],
        errorCount: prev.errorCount + 1,
      }));
    setGameState((prev) => {
      if (!prev) return;
      const updatedWords = [...prev.words];
      updatedWords[prev.currentWordIndex] = currentWord;
      return {
        ...prev,
        words: updatedWords,
        currentLetterIndex: prev.currentLetterIndex + 1,
      };
    });
    return;
  }

  if (isBackspace) {
    const currentLetterIndex = gameState.currentLetterIndex - 1;

    if (currentLetterIndex < 0 && gameState.currentWordIndex === 0) return;
    focusLetterCount.current -= 1;
    const addRemoveRecordToTypingState = (type: LetterDetailType) => {
      if (setTypingState)
        setTypingState((prev) => ({
          ...prev,
          letterDetails: [
            ...prev.letterDetails,
            {
              letter: "BackSpace",
              type,
              timestamp,
            },
          ],
          errorCount: prev.errorCount + 1,
        }));
    };

    if (currentLetterIndex >= 0) {
      if (
        currentLetterIndex >
        gameState.originalWords[gameState.currentWordIndex].length - 1
      ) {
        //remove the last letter of the current word
        setGameState((prev) => {
          if (!prev) return;
          const updatedWords = prev.words.map((word, index) =>
            index === prev.currentWordIndex ? [...word] : word
          );
          updatedWords[prev.currentWordIndex].splice(currentLetterIndex, 1);

          return {
            ...prev,
            words: updatedWords,
            currentLetterIndex: prev.currentLetterIndex - 1,
          };
        });
        addRemoveRecordToTypingState(LetterDetailType.removeExtra);
        return;
      }

      setGameState((prev) => {
        if (!prev) return;
        const updatedWords = prev.words.map((word, index) =>
          index === prev.currentWordIndex
            ? word.map((letter, i) =>
                i === currentLetterIndex
                  ? { ...letter, type: letterType.normal }
                  : letter
              )
            : word
        );

        return {
          ...prev,
          words: updatedWords,
          currentLetterIndex: prev.currentLetterIndex - 1,
        };
      });
      addRemoveRecordToTypingState(LetterDetailType.remove);
      return;
    }
    addRemoveRecordToTypingState(LetterDetailType.previous);
    setGameState((prev) => {
      if (!prev) return;
      return {
        ...prev,
        currentWordIndex: prev.currentWordIndex - 1,
        currentLetterIndex: prev.words[prev.currentWordIndex - 1].length || 0,
      };
    });
  }
};
