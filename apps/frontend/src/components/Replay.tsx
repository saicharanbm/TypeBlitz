import { useCallback, useEffect, useRef, useState } from "react";
import { generateReplayWords } from "../utils";
import { Play, Pause, RotateCcw } from "lucide-react";
import {
  LetterDetailType,
  LetterInfo,
  letterType,
  PlayerState,
  TypingState,
} from "../types";

function Replay({
  words,
  typingData,
  totalTime,
  graphData,
}: {
  words: string[];
  typingData: TypingState;
  totalTime: number;
  graphData: {
    time: number;
    correctCount: number;
    rawCount: number;
    errorCount: number;
    correctWPM: number;
    rawWPM: number;
  }[];
}) {
  const [replayState, setReplayState] = useState<{
    words: LetterInfo[][];
    originalWords: string[];
    currentWordIndex: number;
    currentLetterIndex: number;
  }>();
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.idle);
  const playerPosition = useRef(0);
  const playerTimer = useRef<ReturnType<typeof setTimeout>>();
  const typeTimer = useRef<ReturnType<typeof setInterval>>();
  const [timerCount, SetTimerCount] = useState<number>(0);
  const [wpm, setWPM] = useState(0);
  const initializePlayer = useCallback(() => {
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
  }, [typingData, words]);

  useEffect(() => {
    initializePlayer();
    playerPosition.current = 0;
    if (playerTimer.current) clearTimeout(playerTimer.current);
    clearInterval(typeTimer.current);
    SetTimerCount(0);
    setWPM(0);
    setPlayerState(PlayerState.idle);
  }, [initializePlayer]);

  const runTimer = () => {
    typeTimer.current = setInterval(() => {
      SetTimerCount((prev) => {
        if (prev >= totalTime) {
          clearInterval(typeTimer.current);
          return prev; // Ensure the final value is returned
        }

        if (graphData[prev]) {
          setWPM(graphData[prev].correctWPM);
        }

        return prev + 1; // Increment timerCount
      });
    }, 1000);
  };

  function startReplay() {
    let previousTime = 0;
    if (
      playerPosition.current < typingData.letterDetails.length &&
      playerPosition.current > 0
    )
      previousTime = typingData.letterDetails[playerPosition.current].timestamp;
    if (!replayState) return;
    runTimer();
    setPlayerState(PlayerState.playing);
    const scheduleNextAction = () => {
      if (playerPosition.current >= typingData.letterDetails.length) return; // Stop if we've processed all details

      const detail = typingData.letterDetails[playerPosition.current];

      // Calculate the delay based on the previous time
      const delay = detail.timestamp - previousTime;
      previousTime = detail.timestamp;

      // Schedule the next action after the delay
      playerTimer.current = setTimeout(() => {
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

            break;
          default:
            console.log("Unknown action");
        }

        playerPosition.current += 1;
        // Schedule the next action
        scheduleNextAction();
      }, delay);
    };

    // Start the first action
    scheduleNextAction();
  }
  const stopReplay = () => {
    clearTimeout(playerTimer.current);
    setPlayerState(PlayerState.paused);
    clearInterval(typeTimer.current);
  };
  const restartPlayer = () => {
    initializePlayer();
    playerPosition.current = 0;
    if (playerTimer.current) clearTimeout(playerTimer.current);
    clearInterval(typeTimer.current);
    SetTimerCount(0);
    setWPM(0);
    startReplay();
  };
  if (replayState) {
    return (
      <div className="w-full flex flex-col gap-2 ">
        <div className="w-full flex gap-3 items-center">
          <p className="text-textSecondary font-robotoMono">Replay</p>
          {playerState !== PlayerState.playing ? (
            <Play
              className="text-textSecondary cursor-pointer hover:text-textPrimary transition-colors duration-[150ms]"
              onClick={startReplay}
              size={21}
              strokeWidth={2}
            />
          ) : (
            <Pause
              className="text-textSecondary cursor-pointer hover:text-textPrimary transition-colors duration-[150ms]"
              onClick={stopReplay}
              size={21}
              strokeWidth={2}
            />
          )}

          <RotateCcw
            className="text-textSecondary cursor-pointer hover:text-textPrimary transition-colors duration-[150ms]"
            onClick={restartPlayer}
            size={21}
            strokeWidth={2}
          />
          <p className="text-primaryColor font-robotoMono">{wpm}wpm</p>
          <p className="text-primaryColor font-robotoMono">{timerCount}</p>
        </div>

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
