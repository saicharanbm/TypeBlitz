import { useState, useEffect } from "react";
import { MultiplayerResult, wordDifficulty } from "../../types";
import TypingGraph from "../graph/TypingGraph";

function GameResult({
  words,
  contestResult,
  totalTime,
  difficulty,
  wsConnection,
  userId,
}: {
  words: string[];
  contestResult: MultiplayerResult[];
  totalTime: number;
  difficulty: wordDifficulty;
  wsConnection: WebSocket;
  userId: string;
}) {
  // Find the user with the highest correctLetterCount
  const topScorer = contestResult.reduce((maxUser, user) =>
    user.typingState.correctLetterCount > maxUser.typingState.correctLetterCount
      ? user
      : maxUser
  );

  const isWinner = topScorer.userId === userId;

  // Find the index of the userId in the contestResult array
  const initialSelectedIndex = contestResult.findIndex(
    (user) => user.userId === userId
  );

  const [selected, setSelected] = useState(
    initialSelectedIndex !== -1 ? initialSelectedIndex : 0
  );

  // If contestResult updates, re-check the userId index
  useEffect(() => {
    const newIndex = contestResult.findIndex((user) => user.userId === userId);
    if (newIndex !== -1) {
      setSelected(newIndex);
    }
  }, [contestResult, userId]);

  return (
    <div>
      {isWinner ? (
        <div className="text-green-500 font-bold py-6 text-center">
          🎉 Congratulations, you won! 🎉
        </div>
      ) : (
        <div className="text-red-500 font-bold py-6 text-center">
          Better luck next time!
        </div>
      )}

      <div className="flex items-center gap-3">
        <label
          htmlFor="options"
          className="block md:text-xl lg:text-2xl font-medium text-textPrimary"
        >
          Choose a user:
        </label>
        <select
          id="options"
          name="options"
          className="w-40 px-4 py-2 mt-1 bg-transparent text-white border-2 border-gray-500 rounded-md focus:outline-none focus:border-primaryColor transition"
          onChange={(e) => {
            setSelected(parseInt(e.target.value));
          }}
          value={selected}
        >
          {contestResult.map((result, id) => (
            <option key={result.userId} value={id} className="text-black">
              {result.name}
            </option>
          ))}
        </select>
      </div>

      <TypingGraph
        words={words}
        typingState={contestResult[selected]?.typingState}
        totalTime={totalTime}
        difficulty={difficulty}
        wsConnection={wsConnection}
      />
    </div>
  );
}

export default GameResult;
