import { useRef, useState, useCallback, useEffect } from "react";
import { GameState, letterType, wordDifficulty } from "../types";
import { RotateCw } from "lucide-react";
import { getRandomWord } from "../utils";

function GameArea() {
  const GAME_TIME = useRef<number>(30); // Time in seconds

  const GAME_DIFFICULTY = useRef<wordDifficulty>(wordDifficulty.easy);
  const [gameState, setGameState] = useState<GameState>({
    words: [],
    originalWords: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    gameStatus: "waiting",
    timeLeft: GAME_TIME.current,
    focus: false,
    wpm: 0,
  });
  const gameRef = useRef<HTMLDivElement | null>(null);

  const initializeGame = useCallback((): void => {
    const newOriginalWords = Array.from({ length: 200 }, (_, id) => {
      const word = getRandomWord(GAME_DIFFICULTY.current);
      return id === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    });
    const newWords = newOriginalWords.map((word) =>
      word.split("").map((letter) => ({ letter, type: letterType.normal }))
    );

    setGameState({
      words: newWords,
      originalWords: newOriginalWords,
      currentWordIndex: 0,
      currentLetterIndex: 0,
      gameStatus: "waiting",
      timeLeft: GAME_TIME.current,
      focus: true,
      wpm: 0,
    });
    gameRef.current?.focus();
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  useEffect(() => {
    // initializeGame();

    const checkFocus = () => {
      if (gameRef.current === document.activeElement) {
        setGameState((prev) => {
          const updatedWords = { ...prev, focus: true };
          console.log("In focus : ", updatedWords.focus);
          return updatedWords;
        });

        console.log("Game div is in focus");
      } else {
        console.log("Game div is not in focus");
        setGameState((prev) => {
          const updatedWords = { ...prev, focus: false };
          console.log("Out of focus : ", updatedWords.focus);
          return updatedWords;
        });
      }
    };
    document.addEventListener("focusin", checkFocus);
    document.addEventListener("focusout", checkFocus);

    return () => {
      document.removeEventListener("focusin", checkFocus);
      document.removeEventListener("focusout", checkFocus);
    };
  }, []);

  useEffect(() => {
    if (gameState.gameStatus === "playing") {
      const timer = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
        }));

        if (gameState.timeLeft <= 1) {
          clearInterval(timer);
          setGameState((prev) => ({ ...prev, gameStatus: "finished" }));
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [gameState.gameStatus, gameState.timeLeft]);

  useEffect(() => {
    if (gameState.gameStatus === "finished") {
      const wordsTyped =
        gameState.currentWordIndex +
        gameState.currentLetterIndex /
          gameState.words[gameState.currentWordIndex]?.length;
      setGameState((prev) => ({
        ...prev,
        wpm: Math.round(wordsTyped / (GAME_TIME.current / 60) || 0),
      }));
    }
  }, [gameState.gameStatus]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (gameState.gameStatus === "finished") return;

    const { key } = event;
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";

    if (gameState.gameStatus === "waiting" && isLetter) {
      setGameState((prev) => ({ ...prev, gameStatus: "playing" }));
    }

    const currentWord = gameState.words[gameState.currentWordIndex];
    if (!currentWord) return;

    if (isLetter) {
      const currentLetter = currentWord[gameState.currentLetterIndex];

      if (!currentLetter) {
        currentWord.push({ letter: key, type: letterType.extra });
      } else if (currentLetter.letter === key) {
        currentLetter.type = letterType.correct;
      } else {
        currentLetter.type = letterType.incorrect;
      }

      setGameState((prev) => {
        const updatedWords = [...prev.words];
        updatedWords[prev.currentWordIndex] = currentWord;
        return {
          ...prev,
          words: updatedWords,
          currentLetterIndex: prev.currentLetterIndex + 1,
        };
      });
    }

    if (isSpace) {
      if (
        gameState.currentLetterIndex >=
        gameState.words[gameState.currentWordIndex].length
      ) {
        setGameState((prev) => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          currentLetterIndex: 0,
        }));
        return;
      }
    }

    if (isBackspace) {
      const currentLetterIndex = gameState.currentLetterIndex - 1;

      if (currentLetterIndex < 0 && gameState.currentWordIndex === 0) return;

      if (currentLetterIndex >= 0) {
        if (
          currentLetterIndex >
          gameState.originalWords[gameState.currentWordIndex].length - 1
        ) {
          //remove the last letter of the current word
          setGameState((prev) => {
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
          return;
        }

        setGameState((prev) => {
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
        return;
      }
      setGameState((prev) => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex - 1,
        currentLetterIndex: prev.words[prev.currentWordIndex - 1].length || 0,
      }));
    }
  };

  const changeTime = (time: number) => {
    GAME_TIME.current = time;
    initializeGame();
  };

  const changeDifficulty = (difficulty: wordDifficulty) => {
    GAME_DIFFICULTY.current = difficulty;
    initializeGame();
  };

  return (
    <div>
      <div className="nav w-full flex items-center justify-center pb-4 pt-2 ">
        <div className="time  flex rounded-lg bg-nav py-1 px-2 text-textSecondary font-robotoMono text-lg   ">
          <div
            className={`px-2 cursor-pointer   ${GAME_DIFFICULTY.current === wordDifficulty.easy ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeDifficulty(wordDifficulty.easy);
            }}
          >
            <span>Easy</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 cursor-pointer   ${GAME_DIFFICULTY.current === wordDifficulty.medium ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeDifficulty(wordDifficulty.medium);
            }}
          >
            <span>Medium</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 cursor-pointer   ${GAME_DIFFICULTY.current === wordDifficulty.hard ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeDifficulty(wordDifficulty.hard);
            }}
          >
            <span>Hard</span>
          </div>
          <div
            className={`px-2 cursor-pointer   ${GAME_TIME.current === 15 ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeTime(15);
            }}
          >
            <span>15</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 cursor-pointer   ${GAME_TIME.current === 30 ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeTime(30);
            }}
          >
            <span>30</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 cursor-pointer   ${GAME_TIME.current === 60 ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeTime(60);
            }}
          >
            <span>60</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 cursor-pointer   ${GAME_TIME.current === 120 ? "text-primaryColor" : "hover:text-textPrimary"}`}
            onClick={() => {
              changeTime(120);
            }}
          >
            <span>120</span>
          </div>
        </div>
      </div>
      <div className="flex justify-between select-none items-center mb-8">
        <div className="text-yellow-400 text-xl">
          {gameState.gameStatus === "finished"
            ? `WPM: ${gameState.wpm}`
            : gameState.timeLeft}
        </div>
      </div>
      <div
        className={` relative h-[144px] w-full  ${gameRef.current !== document.activeElement ? "cursor-pointer" : ""} `}
      >
        {!gameState.focus && (
          <div
            className="absolute z-50 h-[144px] w-full bg-[rgb(61,61,58,0.1)] backdrop-blur-sm"
            onClick={(e) => {
              e.stopPropagation();
              gameRef.current?.focus();
            }}
          >
            <div className="w-full h-full flex items-center justify-center ">
              Click here to focus.
            </div>
          </div>
        )}

        <div
          ref={gameRef}
          className={`game-area h-[144px] overflow-hidden leading-[3rem] focus:outline-none font-robotoMono  text-2xl tracking-wide ${
            gameState.gameStatus === "finished" ? "opacity-40" : ""
          }`}
          tabIndex={0}
          role="textbox"
          aria-label="Typing area"
          onKeyDown={handleKeyUp}
        >
          <div className="text-container select-none text-textSecondary">
            {gameState.words.map((word, wordIndex) => (
              <div key={wordIndex} className={`word inline-block mx-1`}>
                {word.map((data, letterIndex) => (
                  <span key={letterIndex} className={`letter ${data.type}`}>
                    {wordIndex === gameState.currentWordIndex &&
                    letterIndex === gameState.currentLetterIndex ? (
                      <span
                        className={`blinking-cursor ${gameState.gameStatus === "playing" ? "" : "blink"}`}
                      ></span>
                    ) : null}
                    {data.letter}
                  </span>
                ))}
                {wordIndex === gameState.currentWordIndex &&
                  gameState.currentLetterIndex >=
                    gameState.words[gameState.currentWordIndex].length && (
                    <span
                      className={`blinking-cursor ${gameState.gameStatus === "playing" ? "" : "blink"}`}
                    ></span>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="w-full p-7 md:p-12  flex items-center justify-center text-textSecondary cursor-pointer hover:text-textPrimary transition-colors duration-[150ms] "
        onClick={initializeGame}
      >
        <RotateCw size={28} strokeWidth={3} />
      </div>
    </div>
  );
}

export default GameArea;
