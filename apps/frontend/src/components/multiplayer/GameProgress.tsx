import { UsersCorrectLetterCount } from "../../types";

function GameProgress({
  usersCorrectLetterList,
}: {
  usersCorrectLetterList: UsersCorrectLetterCount;
}) {
  return (
    <div className="w-full p-8">
      {usersCorrectLetterList.map((user) => {
        return (
          <div key={user.userId} className="w-full flex justify-between">
            <p className="text-textSecondary">{user.name}</p>
            <p className="text-textSecondary">{user.correctLetterCount}</p>
          </div>
        );
      })}
    </div>
  );
}

export default GameProgress;
