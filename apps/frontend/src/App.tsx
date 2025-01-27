import { useRef, useState, useCallback, useEffect } from "react";
import { words } from "./utils/data";
import { GameState, letterType } from "./types";
import Icon from "./components/Icon";

function App() {
  const GAME_TIME = useRef<number>(30); // Time in seconds
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
  const wordsRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);

  const getRandomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const initializeGame = useCallback((): void => {
    const newOriginalWords = Array.from({ length: 200 }, (_, id) => {
      const word = getRandomWord();
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
      return () => clearInterval(timer);
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
        currentWord.push({ letter: key, type: letterType.incorrect });
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

  return (
    <div className="max-w-[1400px] min h-screen mx-auto pt-12 px-4 sm:px-6 lg:px-12 font-robotoSans">
      <nav className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2 lg:gap-4">
          <div className="w-12 md:w-24 lg:w-28">
            <Icon />
          </div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl text-[#d7d6ce] font-bold">
            TypeBlitz
          </h1>
        </div>
      </nav>

      <div className="flex justify-between select-none items-center mb-8">
        <div className="text-yellow-400 text-xl">
          {gameState.gameStatus === "finished"
            ? `WPM: ${gameState.wpm}`
            : gameState.timeLeft}
        </div>
        <button
          onClick={initializeGame}
          className="bg-white/20 text-white/50 px-5 py-1.5 rounded hover:bg-white/30 transition-colors"
        >
          New game
        </button>
      </div>
      <div className=" relative h-[108px] w-full  ">
        {!gameState.focus && (
          <div
            className="absolute z-50 h-[108px] w-full bg-[rgb(61,61,58,0.1)] backdrop-blur-sm"
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
          className={`game-area h-[108px] overflow-hidden leading-9 focus:outline-none font-robotoMono ${
            gameState.gameStatus === "finished" ? "opacity-40" : ""
          }`}
          tabIndex={0}
          role="textbox"
          aria-label="Typing area"
          onKeyDown={handleKeyUp}
        >
          <div
            ref={wordsRef}
            className="text-container select-none text-textSecondary"
          >
            {gameState.words.map((word, wordIndex) => (
              <div key={wordIndex} className={`word inline-block mx-1`}>
                {word.map((data, letterIndex) => (
                  <span key={letterIndex} className={`letter ${data.type}`}>
                    {wordIndex === gameState.currentWordIndex &&
                    letterIndex === gameState.currentLetterIndex ? (
                      <span className="blinking-cursor"></span>
                    ) : null}
                    {data.letter}
                  </span>
                ))}
                {wordIndex === gameState.currentWordIndex &&
                  gameState.currentLetterIndex >=
                    gameState.words[gameState.currentWordIndex].length && (
                    <span className="blinking-cursor"></span>
                  )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
