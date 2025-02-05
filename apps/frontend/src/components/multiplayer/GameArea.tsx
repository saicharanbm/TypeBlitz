import { useRef, useEffect, useState } from "react";
import { GameState, letterType } from "../../types";
import { handleKeyDown } from "../../utils/handleKeyDown";

function GameArea({
  gameState,
  setGameState,
  wsConnection,
  totalTime,
}: {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState | undefined>>;
  wsConnection: WebSocket;
  totalTime: number;
}) {
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

  useEffect(() => {
    const checkFocus = () => {
      if (gameRef.current === document.activeElement) {
        setGameState((prev) => {
          if (!prev) return prev;
          const updatedWords = { ...prev, focus: true };
          console.log("In focus : ", updatedWords.focus);
          return updatedWords;
        });

        console.log("Game div is in focus");
      } else {
        console.log("Game div is not in focus");
        setGameState((prev) => {
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
    if (gameState.gameStatus === "playing") {
      const timer = setInterval(() => {
        setGameState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
          };
        });

        if (gameState.timeLeft <= 1) {
          clearInterval(timer);
          setGameState((prev) => {
            if (!prev) return prev;
            return { ...prev, gameStatus: "finished" };
          });
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
      setGameState((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          wpm: Math.round(wordsTyped / (totalTime / 60) || 0),
        };
      });
    }
  }, [gameState.gameStatus]);

  if (gameState) {
    return (
      <div>
        <div className="flex justify-between select-none items-center mb-8">
          <div className="text-yellow-400 text-xl">{gameState.timeLeft}</div>
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
            className="game-area h-[144px] overflow-hidden leading-[3rem] focus:outline-none font-robotoMono  text-2xl tracking-wide"
            tabIndex={0}
            role="textbox"
            aria-label="Typing area"
            onKeyDown={(event) =>
              handleKeyDown(
                event,
                gameState,
                charsPerLine,
                totalTime,
                setGameState,
                gameRef,
                setLineOffset,
                focusLetterCount
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
      </div>
    );
  }
}

export default GameArea;
