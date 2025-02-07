import { UsersCorrectLetterCount } from "../../types";

function GameProgress({
  usersCorrectLetterList,
  userId,
}: {
  usersCorrectLetterList: UsersCorrectLetterCount;
  userId: string;
}) {
  const maxCorrectLetters = Math.max(
    ...usersCorrectLetterList.map((user) => user.correctLetterCount),
    1
  );
  return (
    <div className="w-full p-8">
      <h2 className="text-textSecondary text-2xl text-center p-2">
        Users Progress
      </h2>
      {usersCorrectLetterList.map((user) => {
        const progress = (user.correctLetterCount / maxCorrectLetters) * 100;
        return (
          <div key={user.userId} className="w-full pt-6">
            <div className="flex justify-between">
              <p
                className={`${
                  user.userId === userId
                    ? "text-primaryColor"
                    : "text-textPrimary"
                }`}
              >
                {user.name}
              </p>
              <p className="text-textSecondary">{user.correctLetterCount}</p>
            </div>
            <div className="w-full  rounded-full h-3 mt-2">
              <div
                className={`${
                  user.userId === userId
                    ? "bg-primaryColor"
                    : "bg-textSecondary"
                } h-3 rounded-full`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GameProgress;
