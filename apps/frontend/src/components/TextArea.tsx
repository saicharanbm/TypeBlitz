import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { handleKeyDown } from "../utils/handleKeyDown";
import { GameState, TypingState } from "../types";

function TextArea({
  gameState,
  setGameState,
  gameRef,
  charsPerLine,
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
  charsPerLine: number;
  totalTime: number;
  focusLetterCount: MutableRefObject<number>;
  lineOffset: number;
  setLineOffset: Dispatch<React.SetStateAction<number>>;
  setTypingState?: Dispatch<SetStateAction<TypingState>>;
  typingState?: TypingState;
  wsConnection?: WebSocket;
}) {
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
        className="game-area h-[144px] overflow-hidden leading-[3rem] focus:outline-none font-robotoMono  text-2xl tracking-wide"
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
