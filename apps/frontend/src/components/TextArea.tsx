import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { handleKeyDown } from "../utils/handleKeyDown";
import { GameState, TypingState } from "../types";

function TextArea({
  gameState,
  setGameState,
  gameRef,
  //   charsPerLine,
  totalTime,
  focusLetterCount,
  lineOffset,
  setLineOffset,
  setTypingState = undefined,
  typingState = undefined,
  wsConnection = undefined,
}: {
  gameState: GameState;
  setGameState: Dispatch<SetStateAction<GameState | undefined>>;
  gameRef: React.RefObject<HTMLDivElement>;
  //   charsPerLine: number;
  totalTime: number;
  focusLetterCount: MutableRefObject<number>;
  lineOffset: number;
  setLineOffset: Dispatch<React.SetStateAction<number>>;
  setTypingState?: Dispatch<SetStateAction<TypingState>>;
  typingState?: TypingState;
  wsConnection?: WebSocket;
}) {
  const [charsPerLine, setCharsPerLine] = useState(0); //approx character in every 2 linesearly

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
      console.log("gameRef.current", gameRef.current);

      // Initial calculation
      calculateCharsPerLine();

      // Handle window resizing
      window.addEventListener("resize", calculateCharsPerLine);

      // Cleanup
      return () => {
        window.removeEventListener("resize", calculateCharsPerLine);
      };
    }
  }, [gameRef]);
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
  }, [gameRef, setGameState]);
  return (
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
        className={`game-area h-[144px] overflow-hidden leading-[3rem] focus:outline-none font-robotoMono  text-2xl tracking-wide ${
          gameState.gameStatus === "finished" ? "opacity-40" : ""
        }`}
        tabIndex={0}
        role="textbox"
        aria-label="Typing area"
        onKeyDown={(event) => {
          if (wsConnection && gameState.gameStatus !== "playing") {
            return;
          }
          handleKeyDown(
            event,
            gameState,
            charsPerLine,
            totalTime,
            setGameState,
            gameRef,
            setLineOffset,
            focusLetterCount,
            setTypingState,
            typingState,
            wsConnection
          );
        }}
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
  );
}

export default TextArea;
