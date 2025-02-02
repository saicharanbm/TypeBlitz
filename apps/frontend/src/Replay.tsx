import { useEffect, useRef, useState } from "react";
import { generateReplayWords } from "./utils";
import { LetterDetailType, LetterInfo, letterType, TypingState } from "./types";

function Replay({
  words,
  typingData,
}: {
  words: string[];
  typingData: TypingState;
}) {
  const data = useRef(generateReplayWords(words, typingData));
  const [replayState, setReplayState] = useState<{
    words: LetterInfo[][];
    originalWords: string[];
    currentWordIndex: number;
    currentLetterIndex: number;
  }>();

  useEffect(() => {
    const newWords = data.current.map((word) =>
      word.split("").map((letter) => ({ letter, type: letterType.normal }))
    );
    setReplayState({
      words: newWords,
      originalWords: data.current,
      currentWordIndex: 0,
      currentLetterIndex: 0,
    });
  }, []);
  function startReplay() {
    let previousTime = 0;
    if (!replayState) return;

    const scheduleNextAction = (index: number) => {
      if (index >= typingData.letterDetails.length) return; // Stop if we've processed all details

      const detail = typingData.letterDetails[index];

      // Calculate the delay based on the previous time
      const delay = detail.timestamp - previousTime;
      previousTime = detail.timestamp;

      // Schedule the next action after the delay
      setTimeout(() => {
        // Handle the action based on the detail type
        switch (detail.type) {
          case LetterDetailType.correct:
            setReplayState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                words: prev.words.map((word, wordIndex) =>
                  word.map((letterInfo, letterIndex) =>
                    wordIndex === prev.currentWordIndex &&
                    letterIndex === prev.currentLetterIndex
                      ? { ...letterInfo, type: letterType.correct }
                      : letterInfo
                  )
                ),
                currentLetterIndex: prev.currentLetterIndex + 1,
              };
            });
            console.log("Correct:", detail.letter);
            break;
          case LetterDetailType.incorrect:
            setReplayState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                words: prev.words.map((word, wordIndex) =>
                  word.map((letterInfo, letterIndex) =>
                    wordIndex === prev.currentWordIndex &&
                    letterIndex === prev.currentLetterIndex
                      ? { ...letterInfo, type: letterType.incorrect }
                      : letterInfo
                  )
                ),
                currentLetterIndex: prev.currentLetterIndex + 1,
              };
            });
            console.log("Incorrect:", detail.letter);
            break;
          case LetterDetailType.next:
            setReplayState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                currentWordIndex: prev.currentWordIndex + 1,
                currentLetterIndex: 0,
              };
            });
            console.log("Next letter");
            break;
          case LetterDetailType.previous:
            console.log("Previous letter");
            break;
          case LetterDetailType.extra:
            console.log("Extra action");
            break;
          case LetterDetailType.remove:
            console.log("Remove action");
            break;
          case LetterDetailType.removeExtra:
            console.log("Remove extra action");
            break;
          default:
            console.log("Unknown action");
        }

        // Schedule the next action
        scheduleNextAction(index + 1);
      }, delay);
    };

    // Start the first action
    scheduleNextAction(0);
  }
  if (replayState) {
    return (
      <div className="w-full flex flex-col gap-4">
        <button onClick={startReplay}>play</button>
        <div className="text-container select-none text-textSecondary">
          {replayState.words.map((word, wordIndex) => (
            <div key={wordIndex} className={`word inline-block mx-1`}>
              {word.map((data, letterIndex) => (
                <span key={letterIndex} className={`letter ${data.type}`}>
                  {wordIndex === replayState.currentWordIndex &&
                  letterIndex === replayState.currentLetterIndex ? (
                    <span className="blinking-cursor playing"></span>
                  ) : null}
                  {data.letter}
                </span>
              ))}
              {wordIndex === replayState.currentWordIndex &&
                replayState.currentLetterIndex >=
                  replayState.words[replayState.currentWordIndex].length && (
                  <span className="blinking-cursor playing"></span>
                )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  return <div>Something went wrong</div>;
}

export default Replay;
