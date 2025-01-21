import { Play } from "lucide-react";
import { useRef, useState, useCallback } from "react";
interface GameState {
  words: string[];
  currentWordIndex: number;
  currentLetterIndex: number;
  gameStatus: "waiting" | "playing" | "finished";
  timeLeft: number;
  wpm: number;
}

const words = [
  "the",
  "be",
  "of",
  "and",
  "a",
  "to",
  "in",
  "he",
  "have",
  "it",
  "that",
  "for",
  "they",
  "I",
  "with",
  "as",
  "not",
  "on",
  "she",
  "at",
  "by",
  "this",
  "we",
  "you",
  "do",
  "but",
  "from",
  "or",
  "which",
  "one",
  "would",
  "all",
  "will",
  "there",
  "say",
  "who",
  "make",
  "when",
  "can",
  "more",
  "if",
  "no",
  "man",
  "out",
  "other",
  "so",
  "what",
  "time",
  "up",
  "go",
  "about",
  "than",
  "into",
  "could",
  "state",
  "only",
  "new",
  "year",
  "some",
  "take",
  "come",
  "these",
  "know",
  "see",
  "use",
  "get",
  "like",
  "then",
  "first",
  "any",
  "work",
  "now",
  "may",
  "such",
  "give",
  "over",
  "think",
  "most",
  "even",
  "find",
  "day",
  "also",
  "after",
  "way",
  "many",
  "must",
  "look",
  "before",
  "great",
  "back",
  "through",
  "long",
  "where",
  "much",
  "should",
  "well",
  "people",
  "down",
  "own",
  "just",
  "because",
  "good",
  "each",
  "those",
  "feel",
  "seem",
  "how",
  "high",
  "too",
  "place",
  "little",
  "world",
  "very",
  "still",
  "nation",
  "hand",
  "old",
  "life",
  "tell",
  "write",
  "become",
  "here",
  "show",
  "house",
  "both",
  "between",
  "need",
  "mean",
  "call",
  "develop",
  "under",
  "last",
  "right",
  "move",
  "thing",
  "general",
  "school",
  "never",
  "same",
  "another",
  "begin",
  "while",
  "number",
  "part",
  "turn",
  "real",
  "leave",
  "might",
  "want",
  "point",
  "form",
  "off",
  "child",
  "few",
  "small",
  "since",
  "against",
  "ask",
  "late",
  "home",
  "interest",
  "large",
  "person",
  "end",
  "open",
  "public",
  "follow",
  "during",
  "present",
  "without",
  "again",
  "hold",
  "govern",
  "around",
  "possible",
  "head",
  "consider",
  "word",
  "program",
  "problem",
  "however",
  "lead",
  "system",
  "set",
  "order",
  "eye",
  "plan",
  "run",
  "keep",
  "face",
  "fact",
  "group",
  "play",
  "stand",
  "increase",
  "early",
  "course",
  "change",
  "help",
  "line",
];

interface WordElementRef extends HTMLDivElement {
  children: HTMLCollectionOf<LetterElement>;
}
interface LetterElement extends HTMLSpanElement {
  className: string;
  textContent: string;
}
function App() {
  const GAME_TIME = useRef<number>(30 * 1000);
  const [gameState, setGameState] = useState<GameState>({
    words: [],
    currentWordIndex: 0,
    currentLetterIndex: 0,
    gameStatus: "waiting",
    timeLeft: GAME_TIME.current / 1000,
    wpm: 0,
  });
  const wordsRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<HTMLDivElement | null>(null);

  const getRandomWord = (): string => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  };

  const initializeGame = useCallback((): void => {
    const newWords = Array.from({ length: 200 }, () => getRandomWord());
    setGameState((prev) => ({
      ...prev,
      words: newWords,
      currentWordIndex: 0,
      currentLetterIndex: 0,
      gameStatus: "waiting",
      timeLeft: GAME_TIME.current / 1000,
      wpm: 0,
    }));
  }, []);

  const getCursorPosition = () => {
    if (!wordsRef.current) return { top: 0, left: 0 };

    const currentWord = wordsRef.current.children[
      gameState.currentWordIndex
    ] as WordElementRef | undefined;
    if (!currentWord) return { top: 0, left: 0 };

    const currentLetter = currentWord.children[gameState.currentLetterIndex];
    const rect = currentLetter
      ? currentLetter.getBoundingClientRect()
      : currentWord.getBoundingClientRect();

    return {
      top: rect.top + 2,
      left: currentLetter ? rect.left : rect.right,
    };
  };
  return (
    <div className="max-w-[1400px] min h-screen mx-auto pt-12  px-4 sm:px-6 lg:px-12 ">
      <nav>
        <h1 className="text-2xl md:text-3xl  lg:text-4xl  text-textPrimary flex items-center gap-2 mb-8">
          <Play className="w-8 h-8 text-primaryColor" />
          TypeBlitz
        </h1>
      </nav>

      <div className="flex justify-between items-center mb-8">
        <div className="text-yellow-400 text-xl">
          {gameState.gameStatus === "finished"
            ? `WPM: ${gameState.wpm}`
            : gameState.timeLeft}
        </div>
        <button
          onClick={initializeGame}
          className="bg-white/20 text-white/50 px-5 py-1.5 rounded hover:bg-white/30 transition-colors"
        >
          New game
        </button>
      </div>
      <div
        ref={gameRef}
        className={`relative h-[105px] overflow-hidden leading-9 focus:outline-none ${
          gameState.gameStatus === "finished" ? "opacity-50" : ""
        }`}
        tabIndex={0}
      >
        <div ref={wordsRef} className={`text-gray-500 `}>
          {gameState.words.map((word, wordIndex) => (
            <div key={wordIndex} className="inline-block font-mono mx-1">
              {word.split("").map((letter, letterIndex) => (
                <span key={letterIndex} className="letter">
                  {letter}
                </span>
              ))}
            </div>
          ))}
        </div>
        {gameState.gameStatus !== "finished" && (
          <div
            className="w-0.5 h-6 bg-yellow-400 fixed animate-[blink_0.3s_infinite]"
            style={{
              top: `${getCursorPosition().top}px`,
              left: `${getCursorPosition().left}px`,
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
