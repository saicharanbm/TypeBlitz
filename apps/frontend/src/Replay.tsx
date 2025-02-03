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
  const [replayState, setReplayState] = useState<{
    words: LetterInfo[][];
    originalWords: string[];
    currentWordIndex: number;
    currentLetterIndex: number;
  }>();

  useEffect(() => {
    const data = generateReplayWords(words, typingData);
    const newWords = data.map((word) =>
      word.split("").map((letter) => ({ letter, type: letterType.normal }))
    );
    setReplayState({
      words: newWords,
      originalWords: data,
      currentWordIndex: 0,
      currentLetterIndex: 0,
    });
    startReplay();
  }, [words, typingData]);
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
            setReplayState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                currentWordIndex: prev.currentWordIndex - 1,
                currentLetterIndex:
                  prev.words[prev.currentWordIndex - 1].length || 0,
              };
            });
            console.log("Previous letter");
            break;
          case LetterDetailType.extra:
            setReplayState((prev) => {
              if (!prev) return prev;
              const currentWord = [...prev.words[prev.currentWordIndex]];
              currentWord.push({
                letter: detail.letter,
                type: letterType.extra,
              });
              const updatedWords = [...prev.words];
              updatedWords[prev.currentWordIndex] = currentWord;
              return {
                ...prev,
                words: updatedWords,
                currentLetterIndex: prev.currentLetterIndex + 1,
              };
            });
            console.log("Extra action");
            break;
          case LetterDetailType.remove:
            setReplayState((prev) => {
              if (!prev) return prev;
              return {
                ...prev,
                words: prev.words.map((word, wordIndex) =>
                  word.map((letterInfo, letterIndex) =>
                    wordIndex === prev.currentWordIndex &&
                    letterIndex === prev.currentLetterIndex - 1
                      ? { ...letterInfo, type: letterType.normal }
                      : letterInfo
                  )
                ),
                currentLetterIndex: prev.currentLetterIndex - 1,
              };
            });
            console.log("Remove action");
            break;
          case LetterDetailType.removeExtra:
            setReplayState((prev) => {
              if (!prev) return prev;
              const updatedWords = prev.words.map((word, index) =>
                index === prev.currentWordIndex ? [...word] : word
              );
              updatedWords[prev.currentWordIndex].splice(
                prev.currentLetterIndex - 1,
                1
              );
              return {
                ...prev,
                words: updatedWords,
                currentLetterIndex: prev.currentLetterIndex - 1,
              };
            });
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
        <div className="leading-[3rem] focus:outline-none font-robotoMono  text-2xl tracking-wide">
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
      </div>
    );
  }
  return <div>Something went wrong</div>;
}

export default Replay;
