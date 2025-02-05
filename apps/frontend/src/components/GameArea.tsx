import { useRef, useState, useCallback, useEffect } from "react";
import { GameState, letterType, TypingState, wordDifficulty } from "../types";
import { RotateCw } from "lucide-react";
import { getRandomWord } from "../utils";
import TypingGraph from "./graph/TypingGraph";
import Options from "./Options";
import TextArea from "./TextArea";

function GameArea() {
  const GAME_TIME = useRef<number>(30); // Time in seconds

  const GAME_DIFFICULTY = useRef<wordDifficulty>(wordDifficulty.easy);
  const [gameState, setGameState] = useState<GameState | undefined>({
    words: [],
    originalWords: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    gameStatus: "waiting",
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
  //claculate chars per line
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

  if (gameState) {
    return (
      <div>
        <Options
          GAME_DIFFICULTY={GAME_DIFFICULTY}
          GAME_TIME={GAME_TIME}
          initializeGame={initializeGame}
        />
        <div className="flex justify-between select-none items-center mb-8">
          <div className="text-yellow-400 text-xl">{gameState?.timeLeft}</div>
        </div>

        <TextArea
          gameState={gameState}
          setGameState={setGameState}
          gameRef={gameRef}
          charsPerLine={charsPerLine}
          totalTime={GAME_TIME.current}
          focusLetterCount={focusLetterCount}
          lineOffset={lineOffset}
          setLineOffset={setLineOffset}
          setTypingState={setTypingState}
          typingState={typingState}
        />
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
