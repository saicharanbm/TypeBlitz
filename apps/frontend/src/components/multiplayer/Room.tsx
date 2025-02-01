import { Keyboard, DoorOpen } from "lucide-react";
import {
  messageType,
  roomDetailsType,
  totalTime,
  wordDifficulty,
} from "../../types";
import { useRef, useState } from "react";
import { isUserAdmin } from "../../utils";

type RoomProps = {
  roomDetails: roomDetailsType;
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >;
  userId: string;
  wsConnection: WebSocket;
};

function Room({
  roomDetails,
  setRoomDetails,
  userId,
  wsConnection,
}: RoomProps) {
  const [message, setMessage] = useState("");
  const isAdmin = useRef<boolean>(isUserAdmin(userId, roomDetails.users));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents form submission (if inside a form)
      if (message.trim()) {
        wsConnection.send(
          JSON.stringify({
            type: "message",
            payload: {
              message,
            },
          })
        );
        setRoomDetails((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            messages: [
              ...prev.messages,
              {
                id: userId,
                name: prev.users.filter((user) => user.userId === userId)[0]
                  ?.name,
                message,
                type: messageType.message,
              },
            ],
          };
        });

        console.log("Sending message:", message);
        setMessage(""); // Clear input after sending
      }
    }
  };

  const startGame = () => {
    wsConnection.send(JSON.stringify({ type: "start-game" }));
  };
  const updateDifficulty = (difficulty: wordDifficulty) => {
    wsConnection.send(
      JSON.stringify({
        type: "update-room-details",
        payload: {
          difficulty,
          time: roomDetails.time,
        },
      })
    );
    setRoomDetails((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        difficulty,
      };
    });
  };
  const updateTime = (time: totalTime) => {
    wsConnection.send(
      JSON.stringify({
        type: "update-room-details",
        payload: {
          difficulty: roomDetails.difficulty,
          time,
        },
      })
    );
    setRoomDetails((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        time,
      };
    });
  };
  return (
    <div className="w-full">
      <div className="nav w-full flex items-center justify-center pb-4 pt-2 select-none">
        <div className="flex rounded-lg bg-nav py-1 px-2 text-textSecondary font-robotoMono text-lg   ">
          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}   ${roomDetails.difficulty === wordDifficulty.easy ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateDifficulty(wordDifficulty.easy);
            }}
          >
            <span>Easy</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}   ${roomDetails.difficulty === wordDifficulty.medium ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateDifficulty(wordDifficulty.medium);
            }}
          >
            <span>Medium</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}  ${roomDetails.difficulty === wordDifficulty.hard ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateDifficulty(wordDifficulty.hard);
            }}
          >
            <span>Hard</span>
          </div>
          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}   ${roomDetails.time === totalTime.fifteen ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateTime(totalTime.fifteen);
            }}
          >
            <span>15s</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}   ${roomDetails.time === totalTime.thirty ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateTime(totalTime.thirty);
            }}
          >
            <span>30s</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}   ${roomDetails.time === totalTime.sixty ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateTime(totalTime.sixty);
            }}
          >
            <span>60s</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div
            className={`px-2 ${isAdmin.current ? "cursor-pointer" : ""}   ${roomDetails.time === totalTime.onetwenty ? "text-primaryColor" : isAdmin.current ? "hover:text-textPrimary" : ""}`}
            onClick={() => {
              if (isAdmin.current) updateTime(totalTime.onetwenty);
            }}
          >
            <span>120s</span>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-[70%_30%] gap-4 py-6 select-none">
        <div className="chat-container grid gap-4">
          <p className="text-textSecondary ">chat</p>

          <div className="chats w-full overflow-scroll text-lg h-96">
            {roomDetails.messages.map((value, id) => {
              return (
                <div
                  key={id}
                  className={`chat w-full flex gap-2 ${value.id === userId ? "text-primaryColor" : "text-textSecondary"}`}
                >
                  <p>{value.name}</p>
                  <p>:</p>
                  <p
                    className={`${value.type === messageType.update ? "text-textSecondary" : "text-textPrimary"}`}
                  >
                    {value.message}
                  </p>
                </div>
              );
            })}
          </div>
          <input
            type="text"
            className="w-full bg-nav rounded-md outline-none p-2 px-4 caret-primaryColor"
            placeholder="Hit enter to send message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className=" flex flex-col gap-6 text-textPrimary">
          <div className=" p-2 flex flex-col gap-4">
            {isAdmin.current ? (
              <div
                className="w-full p-3 flex items-center gap-2 justify-center bg-nav rounded-md hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]"
                onClick={startGame}
              >
                <Keyboard />
                <h3>Start game</h3>
              </div>
            ) : (
              <div className="w-full p-3 flex items-center gap-2 justify-center bg-nav rounded-md  opacity-15">
                <Keyboard />
                <h3>Start game</h3>
              </div>
            )}
            {/* //  (
            //   <div className="w-full p-3 flex items-center gap-2 justify-center bg-nav rounded-md hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]">
            //     <Check />
            //     <h3>Ready</h3>
            //   </div>
            // ) */}

            <div
              className="w-full p-2 flex items-center gap-2 justify-center bg-nav rounded-md hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]"
              onClick={() => wsConnection.close()}
            >
              <DoorOpen />
              <h3>Leave room</h3>
            </div>
          </div>
          <div className="w-full grid gap-2">
            <p className="text-textSecondary">Users</p>
            <div className="user-list w-full  h-[300px] overflow-auto">
              <div className="user w-full ">
                {roomDetails.users.map((user, id) => {
                  return (
                    <p
                      key={id}
                      className={`${user.userId === userId ? "text-primaryColor" : "text-textPrimary"}`}
                    >
                      {user.isAdmin ? `★ ${user.name}` : user.name}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="room-code w-full text-center ">
        <p className="text-textSecondary text-xl">room code</p>
        <h1 className="text-primaryColor text-4xl">{roomDetails.roomId}</h1>
      </div>
    </div>
  );
}

export default Room;
