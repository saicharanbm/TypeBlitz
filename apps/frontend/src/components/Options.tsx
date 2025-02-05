import { wordDifficulty } from "../types";

function Options({
  GAME_DIFFICULTY,
  GAME_TIME,
  initializeGame,
}: {
  GAME_DIFFICULTY: React.MutableRefObject<wordDifficulty>;
  GAME_TIME: React.MutableRefObject<number>;
  initializeGame: () => void;
}) {
  const changeTime = (time: number) => {
    GAME_TIME.current = time;
    initializeGame();
  };

  const changeDifficulty = (difficulty: wordDifficulty) => {
    GAME_DIFFICULTY.current = difficulty;
    initializeGame();
  };
  return (
    <div className="nav w-full flex items-center justify-center pb-4 pt-2 ">
      <div className="flex rounded-lg bg-nav py-1 px-2 text-textSecondary font-robotoMono text-lg   ">
        <div
          className={`px-2 cursor-pointer   ${GAME_DIFFICULTY.current === wordDifficulty.easy ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeDifficulty(wordDifficulty.easy);
          }}
        >
          <span>Easy</span>
        </div>
        <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

        <div
          className={`px-2 cursor-pointer   ${GAME_DIFFICULTY.current === wordDifficulty.medium ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeDifficulty(wordDifficulty.medium);
          }}
        >
          <span>Medium</span>
        </div>
        <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

        <div
          className={`px-2 cursor-pointer   ${GAME_DIFFICULTY.current === wordDifficulty.hard ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeDifficulty(wordDifficulty.hard);
          }}
        >
          <span>Hard</span>
        </div>
        <div
          className={`px-2 cursor-pointer   ${GAME_TIME.current === 15 ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeTime(15);
          }}
        >
          <span>15</span>
        </div>
        <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

        <div
          className={`px-2 cursor-pointer   ${GAME_TIME.current === 30 ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeTime(30);
          }}
        >
          <span>30</span>
        </div>
        <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

        <div
          className={`px-2 cursor-pointer   ${GAME_TIME.current === 60 ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeTime(60);
          }}
        >
          <span>60</span>
        </div>
        <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

        <div
          className={`px-2 cursor-pointer   ${GAME_TIME.current === 120 ? "text-primaryColor" : "hover:text-textPrimary"}`}
          onClick={() => {
            changeTime(120);
          }}
        >
          <span>120</span>
        </div>
      </div>
    </div>
  );
}

export default Options;
