import { Keyboard, DoorOpen } from "lucide-react";
function Room() {
  return (
    <div className="w-full">
      <div className="time w-full flex items-center justify-center  p-2 ">
        <div className="time  flex rounded-lg bg-nav py-1 px-2 text-textSecondary font-robotoMono text-lg   ">
          <div className={`px-2 cursor-pointer  "hover:text-textPrimary"}`}>
            <span>15</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>
          <div
            className={`px-2 cursor-pointer  text-primaryColor  "hover:text-textPrimary"}`}
          >
            <span>30</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div className={`px-2 cursor-pointer   "hover:text-textPrimary"}`}>
            <span>60</span>
          </div>
          <div className="spacer w-1 my-1 rounded-md bg-bgColor"></div>

          <div className={`px-2 cursor-pointer    "hover:text-textPrimary"}`}>
            <span>120</span>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-[70%_30%] gap-4 py-6">
        <div className="chat-container ">
          <p className="text-textSecondary">chat</p>
          <div className="w-full h-96 "></div>
          <input
            type="text"
            className="w-full bg-nav rounded-md outline-none p-2 px-4 caret-primaryColor"
            placeholder="Hit enter to send message"
          />
        </div>
        <div className="p-2 flex flex-col gap-6 text-textPrimary">
          <div className="flex flex-col gap-4">
            <div className="w-full p-3 flex items-center gap-2 justify-center bg-nav rounded-md hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]">
              <Keyboard />
              <h3>Start test</h3>
            </div>
            <div className="w-full p-2 flex items-center gap-2 justify-center bg-nav rounded-md hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]">
              <DoorOpen />
              <h3>Leave room</h3>
            </div>
          </div>
          <div>
            <p className="text-textSecondary">Users</p>
          </div>
        </div>
      </div>

      <div className="room-code w-full text-center ">
        <p className="text-textSecondary text-xl">room code</p>
        <h1 className="text-primaryColor text-4xl">bbd5b5</h1>
      </div>
    </div>
  );
}

export default Room;
