import { useRef, useState, useCallback, useEffect } from "react";
import { words } from "./utils/data";
import { GameState, letterType } from "./types";

function App() {
  const GAME_TIME = useRef<number>(30); // Time in seconds
  const [gameState, setGameState] = useState<GameState>({
    words: [],
    originalWords: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    gameStatus: "waiting",
    timeLeft: GAME_TIME.current,
    wpm: 0,
  });
  const wordsRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);

  const getRandomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * words.length);
    const word = words[randomIndex];

    return word;
  };

  const initializeGame = useCallback((): void => {
    const newOriginalWords = Array.from({ length: 200 }, (_, id) => {
      const word = getRandomWord();
      console.log(id);
      return id === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    });
    const newWords = newOriginalWords.map((word) => {
      const newWord = word
        .split("")
        .map((letter) => ({ letter, type: letterType.normal }));
      return newWord;
    });
    setGameState({
      words: newWords,
      originalWords: newOriginalWords,
      currentWordIndex: 0,
      currentLetterIndex: 0,
      gameStatus: "waiting",
      timeLeft: GAME_TIME.current,
      wpm: 0,
    });
    gameRef.current?.focus();
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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
    // if the game is finished return
    if (gameState.gameStatus === "finished") return;

    const { key } = event;
    //we need to handel 3 conditions letter, space, backspace
    const isLetter = key.length === 1 && key !== " ";
    const isSpace = key === " ";
    const isBackspace = key === "Backspace";

    //if the game is waiting and a letter is pressed, start the game
    if (gameState.gameStatus === "waiting" && isLetter) {
      setGameState((prev) => ({ ...prev, gameStatus: "playing" }));
    }
    //get the current word html element and current letter html element to verify that the user is typing the correct letter

    const currentWord = gameState.words[gameState.currentWordIndex];
    // const currentWordDiv =
    //   wordsRef.current?.children[gameState.currentWordIndex];
    if (!currentWord) return;

    if (isLetter) {
      const currentLetter = currentWord[gameState.currentLetterIndex];

      if (!currentLetter) {
        // Add the letter with incorrect class to the current wordDiv
        currentWord.push({ letter: key, type: letterType.incorrect });
        setGameState((prev) => {
          const updatedWords = [...prev.words];
          updatedWords[prev.currentWordIndex] = currentWord;
          return {
            ...prev,
            words: updatedWords,
          };
        });
      } else if (currentLetter.letter === key) {
        // Add the correct class to the letter and remove incorrect class
        currentLetter.type = letterType.correct;
        setGameState((prev) => {
          const updatedWords = [...prev.words];
          updatedWords[prev.currentWordIndex][prev.currentLetterIndex] =
            currentLetter;
          return {
            ...prev,
            words: updatedWords,
          };
        });
      } else {
        currentLetter.type = letterType.incorrect;
        setGameState((prev) => {
          const updatedWords = [...prev.words];
          updatedWords[prev.currentWordIndex][prev.currentLetterIndex] =
            currentLetter;
          return {
            ...prev,
            words: updatedWords,
          };
        });
      }
    }

    if (isSpace) {
      //we need to handle 2 cases 1) space i  the middle of the word and 2) space at the end of the word
      if (
        gameState.currentLetterIndex >=
        gameState.words[gameState.currentWordIndex].length
      ) {
        //we need to move to the next word
        setGameState((prev) => ({
          ...prev,
          currentWordIndex: prev.currentWordIndex + 1,
          currentLetterIndex: 0,
        }));
        return;
      }
      // get the current letter and add the incorrect class
      const currentLetter = currentWord[gameState.currentLetterIndex];
      if (currentLetter) {
        currentLetter.type = letterType.incorrect;
        setGameState((prev) => {
          const updatedWords = [...prev.words];
          updatedWords[prev.currentWordIndex][prev.currentLetterIndex] =
            currentLetter;
          return {
            ...prev,
            words: updatedWords,
          };
        });
      }
      return;
    }

    if (isBackspace) {
      //we need to handle 2 cases 1) backspace i  the middle of the word and 2) backspace at the start of the word
      const currentLetterIndex = gameState.currentLetterIndex - 1;
      console.log(currentLetterIndex, gameState.currentWordIndex);

      if (currentLetterIndex < 0 && gameState.currentWordIndex === 0) return;
      console.log("hello");

      if (currentLetterIndex >= 0) {
        const currentLetter = currentWord[currentLetterIndex];
        if (currentLetter) {
          console.log(
            gameState.originalWords[gameState.currentWordIndex].length
          );
          if (
            currentLetterIndex >
            gameState.originalWords[gameState.currentWordIndex].length - 1
          ) {
            //remove the last letter of the current word
            setGameState((prev) => {
              const updatedWords = [...prev.words];
              console.log(updatedWords[prev.currentWordIndex]);
              updatedWords[prev.currentWordIndex].splice(currentLetterIndex, 1);
              return {
                ...prev,
                words: updatedWords,
              };
            });
          } else {
            currentLetter.type = letterType.normal;
            setGameState((prev) => {
              const updatedWords = [...prev.words];
              updatedWords[prev.currentWordIndex][currentLetterIndex] =
                currentLetter;
              return {
                ...prev,
                words: updatedWords,
              };
            });
          }
        }
        setGameState((prev) => ({
          ...prev,
          currentLetterIndex: prev.currentLetterIndex - 1,
        }));
        return;
      }

      // move the pointer to the end of the previous word
      // end of prevoius word might not be its lenght because of the error text at the end
      // so het the content of that div
      const previousWordDiv =
        wordsRef.current?.children[gameState.currentWordIndex - 1];
      if (!previousWordDiv) return;

      setGameState((prev) => ({
        ...prev,
        currentWordIndex: prev.currentWordIndex - 1,
        currentLetterIndex: previousWordDiv.children.length,
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      currentLetterIndex: prev.currentLetterIndex + 1,
    }));
  };

  return (
    <div className="max-w-[1400px] min h-screen mx-auto pt-12 px-4 sm:px-6 lg:px-12">
      <nav>
        <div className="p-0 m-0 w-28">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="50 50 200 100"
            width="100%"
            height="auto"
            preserveAspectRatio="none"
          >
            <rect
              x="50"
              y="50"
              width="200"
              height="100"
              rx="15"
              fill="#e0e0e0"
              stroke="#333333"
              stroke-width="4"
            />

            <g fill="#ffffff" stroke="#333333" stroke-width="2">
              <rect x="60" y="60" width="45" height="45" rx="5" />
              <rect x="110" y="60" width="20" height="20" rx="5" />
              <rect x="135" y="60" width="20" height="20" rx="5" />
              <rect x="160" y="60" width="20" height="20" rx="5" />
              <rect x="185" y="60" width="20" height="20" rx="5" />
              <rect x="210" y="60" width="20" height="20" rx="5" />

              <rect x="110" y="85" width="20" height="20" rx="5" />
              <rect x="135" y="85" width="20" height="20" rx="5" />
              <rect x="160" y="85" width="20" height="20" rx="5" />

              <rect x="60" y="110" width="20" height="20" rx="5" />
              <rect x="85" y="110" width="20" height="20" rx="5" />
              <rect x="110" y="110" width="20" height="20" rx="5" />
              <rect x="135" y="110" width="20" height="20" rx="5" />
              <rect x="160" y="110" width="20" height="20" rx="5" />

              <rect x="185" y="85" width="45" height="45" rx="5" />
            </g>

            <text
              x="82"
              y="85"
              font-family="Arial"
              font-size="30"
              font-weight="bold"
              fill="#333333"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              T
            </text>

            <text
              x="207"
              y="110"
              font-family="Arial"
              font-size="30"
              font-weight="bold"
              fill="#333333"
              text-anchor="middle"
              dominant-baseline="middle"
            >
              B
            </text>
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-textPrimary flex items-center gap-2 mb-8">
          TypeBlitz
        </h1>
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
      <div
        ref={gameRef}
        className={`game-area relative h-[108px] overflow-hidden leading-9 focus:outline-none ${
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
            <div
              key={wordIndex}
              className={`word inline-block font-robotoMono mx-1 `}
            >
              {word.map((data, letterIndex) => (
                <span key={letterIndex} className={`letter ${data.type}`}>
                  {data.letter}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
