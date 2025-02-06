import { useState } from "react";
import { MultiplayerResult, wordDifficulty } from "../../types";
import TypingGraph from "../graph/TypingGraph";

function GameResult({
  words,
  contestResult,
  totalTime,
  difficulty,
  wsConnection,
}: {
  words: string[];
  contestResult: MultiplayerResult[];
  totalTime: number;
  difficulty: wordDifficulty;
  wsConnection: WebSocket;
}) {
  const [selected, setSelected] = useState(0);
  return (
    <div>
      <label htmlFor="options">Choose a user :</label>
      <select
        id="options"
        name="options"
        className="w-28 bg-transparent border-2 border-nav rounded-lg"
        onChange={(e) => {
          setSelected(parseInt(e.target.value));
        }}
      >
        {contestResult.map((result, id) => {
          return (
            <option key={result.userId} value={id}>
              {result.name}
            </option>
          );
        })}
      </select>

      {/* <div>{JSON.stringify(contestResult, null, 2)}</div> */}
      {/* <div>{contestResult[selected].name}</div>
      <div>{contestResult[selected].correctLetterCount}</div>
      <div>{contestResult[selected].errorCount}</div> */}
      <TypingGraph
        words={words}
        typingState={contestResult[selected].typingState}
        totalTime={totalTime}
        difficulty={difficulty}
        wsConnection={wsConnection}
      />
    </div>
  );
}

export default GameResult;
