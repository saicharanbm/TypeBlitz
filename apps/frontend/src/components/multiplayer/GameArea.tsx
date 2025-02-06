import { useRef, useEffect, useState } from "react";
import { GameState } from "../../types";
import TextArea from "../TextArea";
import { showToastSuccess } from "../../utils";

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
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [lineOffset, setLineOffset] = useState(0);
  const focusLetterCount = useRef(0);

  //Time while Playing
  useEffect(() => {
    if (gameState.gameStatus === "finished") {
      clearInterval(timerRef.current);
      return;
    }
    if (gameState.gameStatus === "playing") {
      gameRef.current?.focus();
      timerRef.current = setInterval(() => {
        setGameState((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            timeLeft: prev.timeLeft > 0 ? prev.timeLeft - 1 : 0,
          };
        });

        if (gameState.timeLeft <= 1) {
          clearInterval(timerRef.current);
          setGameState((prev) => {
            if (!prev) return prev;
            return { ...prev, gameStatus: "finished" };
          });
          showToastSuccess("Game Finished waiting for other players.");
          wsConnection.send(
            JSON.stringify({
              type: "update-GameStatus",
              payload: {
                type: "finished",
              },
            })
          );
        }
      }, 1000);
      return () => {
        clearInterval(timerRef.current);
      };
    }
  }, [gameState.gameStatus, gameState.timeLeft, setGameState, wsConnection]);

  if (gameState) {
    return (
      <div>
        <div className="flex justify-between select-none items-center mb-8">
          {gameState.gameStatus === "playing" ? (
            <div className="text-yellow-400 text-xl">{gameState.timeLeft}</div>
          ) : gameState.gameStatus === "finished" ? (
            <div className="text-yellow-400 text-xl">Game Finished.</div>
          ) : (
            <div className="text-yellow-400 text-xl">
              Wait for the game to start
            </div>
          )}
        </div>

        <TextArea
          gameState={gameState}
          setGameState={setGameState}
          gameRef={gameRef}
          totalTime={totalTime}
          focusLetterCount={focusLetterCount}
          lineOffset={lineOffset}
          setLineOffset={setLineOffset}
          wsConnection={wsConnection}
        />
      </div>
    );
  }
}

export default GameArea;
