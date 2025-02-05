import { useRef, useState, useCallback, useEffect } from "react";
import { GameState, letterType, TypingState, wordDifficulty } from "../types";
import { RotateCw } from "lucide-react";
import { getRandomWord } from "../utils";
import TypingGraph from "./graph/TypingGraph";
import { handleKeyDown } from "../utils/handleKeyDown";

function GameArea() {
  const GAME_TIME = useRef<number>(30); // Time in seconds

  const GAME_DIFFICULTY = useRef<wordDifficulty>(wordDifficulty.easy);
  const [gameState, setGameState] = useState<GameState | undefined>({
    words: [],
    originalWords: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    gameStatus: "room",
    timeLeft: 0,
    focus: false,
  });
  const [typingState, setTypingState] = useState<TypingState>({
    startTimestamp: null,
    endTimestamp: null,
    letterDetails: [],
    correctLetterCount: 0,
    errorCount: 0,
  });

  const gameRef = useRef<HTMLDivElement | null>(null);
  const [lineOffset, setLineOffset] = useState(0);
  const [charsPerLine, setCharsPerLine] = useState(0); //approx character in every 2 linesearly
  const focusLetterCount = useRef(0);
  useEffect(() => {
    if (gameRef.current) {
      const calculateCharsPerLine = () => {
        const containerWidth = gameRef.current
          ? gameRef.current.getBoundingClientRect().width
          : 0;

        const charWidth = 15.2;

        const calculatedCharsPerLine =
          Math.floor(containerWidth / charWidth) * 2;
        setCharsPerLine(calculatedCharsPerLine);
      };

      // Initial calculation
      calculateCharsPerLine();

      // Handle window resizing
      window.addEventListener("resize", calculateCharsPerLine);

      // Cleanup
      return () => {
        window.removeEventListener("resize", calculateCharsPerLine);
      };
    }
  }, []);
  // const scrollUpOneLine = () => {
  //   const lineHeight = 48;

  //   gameRef.current?.focus();
  //   setLineOffset((prev) => prev + lineHeight);
  //   focusLetterCount.current = Math.round(focusLetterCount.current / 2);
  // };

  const initializeGame = useCallback((): void => {
    const newOriginalWords = Array.from({ length: 200 }, () => {
      return getRandomWord(GAME_DIFFICULTY.current);
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
    });
    setTypingState({
      startTimestamp: null,
      endTimestamp: null,
      letterDetails: [],
      correctLetterCount: 0,
      errorCount: 0,
    });
    setLineOffset(0);
    focusLetterCount.current = 0;

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
          if (!prev) return;
          const updatedWords = { ...prev, focus: true };
          console.log("In focus : ", updatedWords.focus);
          return updatedWords;
        });

        console.log("Game div is in focus");
      } else {
        console.log("Game div is not in focus");
        setGameState((prev) => {
          if (!prev) return;
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
    if (gameState?.gameStatus === "playing") {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (!prev) return;
          return {
            ...prev,
            timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
          };
        });

        if (gameState.timeLeft <= 1) {
          clearInterval(timer);
          setGameState((prev) => {
            if (!prev) return;
            return { ...prev, gameStatus: "finished" };
          });
        }
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [gameState?.gameStatus, gameState?.timeLeft]);

  const changeTime = (time: number) => {
    GAME_TIME.current = time;
    initializeGame();
  };

  const changeDifficulty = (difficulty: wordDifficulty) => {
    GAME_DIFFICULTY.current = difficulty;
    initializeGame();
  };
  {
    if (gameState?.gameStatus === "finished")
      return (
        <TypingGraph
          words={gameState.originalWords}
          typingState={typingState}
          totalTime={GAME_TIME.current}
          difficulty={GAME_DIFFICULTY.current}
          initializeGame={initializeGame}
        />
      );
    // <Replay words={gameState.originalWords} typingData={typingState} />
  }

  if (gameState) {
    return (
      <div>
        <div className="nav w-full flex items-center justify-center pb-4 pt-2 ">
          <div className="flex rounded-lg bg-nav py-1 px-2 text-textSecondary font-robotoMono text-lg   ">
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
          <div className="text-yellow-400 text-xl">{gameState?.timeLeft}</div>
        </div>
        <div
          className={` relative h-[144px] w-full  ${gameRef.current !== document.activeElement ? "cursor-pointer" : ""} `}
        >
          {!gameState?.focus && (
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
            className="game-area h-[144px] overflow-hidden leading-[3rem] focus:outline-none font-robotoMono  text-2xl tracking-wide"
            tabIndex={0}
            role="textbox"
            aria-label="Typing area"
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                gameState,
                charsPerLine,
                GAME_TIME.current,
                setGameState,
                gameRef,
                setLineOffset,
                focusLetterCount,
                setTypingState,
                typingState
              )
            }
          >
            <div
              className="text-container select-none text-textSecondary"
              style={{ transform: `translateY(-${lineOffset}px)` }}
            >
              {gameState.words.map((word, wordIndex) => (
                <div key={wordIndex} className={`word inline-block mx-1`}>
                  {word.map((data, letterIndex) => (
                    <span key={letterIndex} className={`letter ${data.type}`}>
                      {wordIndex === gameState.currentWordIndex &&
                      letterIndex === gameState.currentLetterIndex ? (
                        <span
                          className={`blinking-cursor ${
                            gameState.gameStatus === "playing" ? "" : "blink"
                          }`}
                        ></span>
                      ) : null}
                      {data.letter}
                    </span>
                  ))}
                  {wordIndex === gameState.currentWordIndex &&
                    gameState.currentLetterIndex >=
                      gameState.words[gameState.currentWordIndex].length && (
                      <span
                        className={`blinking-cursor ${
                          gameState.gameStatus === "playing" ? "" : "blink"
                        }`}
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
}

export default GameArea;
