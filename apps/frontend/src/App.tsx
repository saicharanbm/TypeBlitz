import { Play } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import { words } from "./utils/data";
import { GameState } from "./types";

function App() {
  const GAME_TIME = useRef<number>(30); // Time in seconds
  const [gameState, setGameState] = useState<GameState>({
    words: [],
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
    return words[randomIndex];
  };

  const initializeGame = useCallback((): void => {
    const newWords = Array.from({ length: 200 }, () => getRandomWord());
    setGameState({
      words: newWords,
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

    const currentWordDiv =
      wordsRef.current?.children[gameState.currentWordIndex];
    if (!currentWordDiv) return;

    if (isLetter) {
      const currentLetter =
        currentWordDiv.children[gameState.currentLetterIndex];

      if (currentLetter && currentLetter.textContent === key) {
        // Add the correct class to the letter and remove incorrect class
        currentLetter.classList.add("text-correct");
        currentLetter.classList.remove("text-incorrect");
        currentLetter.classList.remove("text-textSecondary");
      } else {
        if (
          gameState.currentLetterIndex >=
          gameState.words[gameState.currentWordIndex].length
        ) {
          // Add the letter with incorrect class to the current wordDiv
          const incorrectLetter = document.createElement("span");
          incorrectLetter.className = "letter text-incorrect";
          incorrectLetter.textContent = key;
          currentWordDiv.appendChild(incorrectLetter);
        } else if (currentLetter) {
          currentLetter.classList.add("text-incorrect");
          currentLetter.classList.remove("text-correct");
          currentLetter.classList.remove("text-textSecondary");
        }
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
      const currentLetter =
        currentWordDiv.children[gameState.currentLetterIndex];
      if (currentLetter) {
        currentLetter.classList.add("text-incorrect");
      }
      return;
    }

    if (isBackspace) {
      //we need to handle 2 cases 1) backspace i  the middle of the word and 2) backspace at the start of the word

      if (
        gameState.currentLetterIndex === 0 &&
        gameState.currentWordIndex === 0
      )
        return;

      if (gameState.currentLetterIndex !== 0) {
        const currentLetter =
          currentWordDiv.children[gameState.currentLetterIndex - 1];
        if (currentLetter) {
          if (
            gameState.currentLetterIndex >
            gameState.words[gameState.currentWordIndex].length
          ) {
            console.log("hello");
            currentWordDiv.removeChild(currentLetter);
          } else {
            currentLetter.classList.remove("text-correct", "text-incorrect");
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
        <h1 className="text-2xl md:text-3xl lg:text-4xl text-textPrimary flex items-center gap-2 mb-8">
          <Play className="w-8 h-8 text-primaryColor" />
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
        onKeyUp={handleKeyUp}
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
              {word.split("").map((letter, letterIndex) => (
                <span key={letterIndex} className="letter text-textSecondary">
                  {letter}
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
