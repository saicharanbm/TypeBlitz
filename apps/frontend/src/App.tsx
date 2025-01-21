import { Play } from "lucide-react";
import { useRef, useState, useCallback, useEffect } from "react";
import { words } from "./utils/data";
import { GameState } from "./types";

function App() {
  const GAME_TIME = useRef<number>(30 * 1000);
  const [gameState, setGameState] = useState<GameState>({
    words: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    gameStatus: "waiting",
    timeLeft: GAME_TIME.current / 1000,
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
    setGameState((prev) => ({
      ...prev,
      words: newWords,
      currentWordIndex: 0,
      currentLetterIndex: 0,
      gameStatus: "playing",
      timeLeft: GAME_TIME.current / 1000,
      wpm: 0,
    }));
  }, []);
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

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
      // startTimer();
    }
    //get the current word html element and current letter html element to verify that the user is typing the correct letter
    const currentWordDiv =
      wordsRef.current?.children[gameState.currentWordIndex];
    if (!currentWordDiv) return;
    if (isLetter) {
      const currentLetter =
        currentWordDiv.children[gameState.currentLetterIndex];

      if (currentLetter && currentLetter.textContent === key) {
        console.log("correct letter");
        // Add the correct class to the letter
        currentLetter.classList.remove("text-incorrect");
        currentLetter.classList.add("text-correct");
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
          console.log("incorrect letter");
          currentLetter.classList.remove("text-correct");
          currentLetter.classList.add("text-incorrect");
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
        currentLetter.classList.remove("text-correct");
        currentLetter.classList.add("text-incorrect");
      }
      return;
    }
    if (isBackspace) {
      //we need to handle 2 cases 1) backspace i  the middle of the word and 2) backspace at the start of the word
      console.log(gameState.currentLetterIndex);
      if (
        gameState.currentLetterIndex === 0 &&
        gameState.currentWordIndex === 0
      )
        return;
      if (gameState.currentLetterIndex !== 0) {
        const currentLetter =
          currentWordDiv.children[gameState.currentLetterIndex - 1];

        if (currentLetter) {
          //if the currennt index is greater than the length of the word then delete the last letter
          if (
            gameState.currentLetterIndex >
            gameState.words[gameState.currentWordIndex].length
          ) {
            console.log("hello");
            currentWordDiv.removeChild(currentLetter);
          } else {
            currentLetter.classList.remove("text-correct");
            currentLetter.classList.remove("text-incorrect");
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

      console.log(previousWordDiv.children.length);
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
    <div className="max-w-[1400px] min h-screen mx-auto pt-12  px-4 sm:px-6 lg:px-12 ">
      <nav>
        <h1 className="text-2xl md:text-3xl  lg:text-4xl  text-textPrimary flex items-center gap-2 mb-8">
          <Play className="w-8 h-8 text-primaryColor" />
          TypeBlitz
        </h1>
      </nav>

      <div className="flex justify-between select-none items-center mb-8">
        <div className="text-yellow-400 text-xl ">
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
        onKeyUp={handleKeyUp}
      >
        <div
          ref={wordsRef}
          className={`text-container select-none text-textSecondary`}
        >
          {gameState.words.map((word, wordIndex) => (
            <div
              key={wordIndex}
              className="word inline-block font-robotoMono mx-1"
            >
              {word.split("").map((letter, letterIndex) => (
                <span key={letterIndex} className="letter">
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        <div className="w-full h-[108px] absolute top-0 left-0  bg-transparent"></div>
      </div>
    </div>
  );
}

export default App;
