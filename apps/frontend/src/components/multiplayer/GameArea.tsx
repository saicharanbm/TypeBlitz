import { useRef, useEffect } from "react";
import { GameState, letterType } from "../../types";

function GameArea({
  gameData,
  setGameData,

  time,
}: {
  gameData: GameState;
  setGameData: React.Dispatch<React.SetStateAction<GameState | undefined>>;

  time: number;
}) {
  const gameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // initializeGame();

    const checkFocus = () => {
      if (gameRef.current === document.activeElement) {
        setGameData((prev) => {
          if (!prev) return prev;
          const updatedWords = { ...prev, focus: true };
          console.log("In focus : ", updatedWords.focus);
          return updatedWords;
        });

        console.log("Game div is in focus");
      } else {
        console.log("Game div is not in focus");
        setGameData((prev) => {
          if (!prev) return prev;
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
    if (gameData.gameStatus === "playing") {
      const timer = setInterval(() => {
        setGameData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
          };
        });

        if (gameData.timeLeft <= 1) {
          clearInterval(timer);
          setGameData((prev) => {
            if (!prev) return prev;
            return { ...prev, gameStatus: "finished" };
          });
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [gameData.gameStatus, gameData.timeLeft]);

  useEffect(() => {
    if (gameData.gameStatus === "finished") {
      const wordsTyped =
        gameData.currentWordIndex +
        gameData.currentLetterIndex /
          gameData.words[gameData.currentWordIndex]?.length;
      setGameData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          wpm: Math.round(wordsTyped / (time / 60) || 0),
        };
      });
    }
  }, [gameData.gameStatus]);

  const handleKeyUp = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (gameData.gameStatus === "finished") return;

    const { key } = event;
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";

    if (gameData.gameStatus === "waiting" && isLetter) {
      setGameData((prev) => {
        if (!prev) return prev;
        return { ...prev, gameStatus: "playing" };
      });
    }

    const currentWord = gameData.words[gameData.currentWordIndex];
    if (!currentWord) return;

    if (isLetter) {
      const currentLetter = currentWord[gameData.currentLetterIndex];

      if (!currentLetter) {
        currentWord.push({ letter: key, type: letterType.extra });
      } else if (currentLetter.letter === key) {
        currentLetter.type = letterType.correct;
      } else {
        currentLetter.type = letterType.incorrect;
      }

      setGameData((prev) => {
        if (!prev) return prev;
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
        gameData.currentLetterIndex >=
        gameData.words[gameData.currentWordIndex].length
      ) {
        setGameData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentWordIndex: prev.currentWordIndex + 1,
            currentLetterIndex: 0,
          };
        });
        return;
      }
    }

    if (isBackspace) {
      const currentLetterIndex = gameData.currentLetterIndex - 1;

      if (currentLetterIndex < 0 && gameData.currentWordIndex === 0) return;

      if (currentLetterIndex >= 0) {
        if (
          currentLetterIndex >
          gameData.originalWords[gameData.currentWordIndex].length - 1
        ) {
          //remove the last letter of the current word
          setGameData((prev) => {
            if (!prev) return prev;
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

        setGameData((prev) => {
          if (!prev) return prev;
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
      setGameData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentWordIndex: prev.currentWordIndex - 1,
          currentLetterIndex: prev.words[prev.currentWordIndex - 1].length || 0,
        };
      });
    }
  };

  return (
    <div>
      <div className="flex justify-between select-none items-center mb-8">
        <div className="text-yellow-400 text-xl">
          {gameData.gameStatus === "finished"
            ? `WPM: ${gameData.wpm}`
            : gameData.timeLeft}
        </div>
      </div>
      <div
        className={` relative h-[144px] w-full  ${gameRef.current !== document.activeElement ? "cursor-pointer" : ""} `}
      >
        {!gameData.focus && (
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
            gameData.gameStatus === "finished" ? "opacity-40" : ""
          }`}
          tabIndex={0}
          role="textbox"
          aria-label="Typing area"
          onKeyDown={handleKeyUp}
        >
          <div className="text-container select-none text-textSecondary">
            {gameData.words.map((word, wordIndex) => (
              <div key={wordIndex} className={`word inline-block mx-1`}>
                {word.map((data, letterIndex) => (
                  <span key={letterIndex} className={`letter ${data.type}`}>
                    {wordIndex === gameData.currentWordIndex &&
                    letterIndex === gameData.currentLetterIndex ? (
                      <span
                        className={`blinking-cursor ${gameData.gameStatus === "playing" ? "" : "blink"}`}
                      ></span>
                    ) : null}
                    {data.letter}
                  </span>
                ))}
                {wordIndex === gameData.currentWordIndex &&
                  gameData.currentLetterIndex >=
                    gameData.words[gameData.currentWordIndex].length && (
                    <span
                      className={`blinking-cursor ${gameData.gameStatus === "playing" ? "" : "blink"}`}
                    ></span>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameArea;
