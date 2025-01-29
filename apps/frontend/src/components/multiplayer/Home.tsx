import { memo, useState } from "react";
import { Users, CodeXml } from "lucide-react";
import JoinRoom from "./JoinRoom";
import CreateRoom from "./CreateRoom";
import { HomeProps } from "../../types";

const Home = memo(({ userId, wsConnection }: HomeProps) => {
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);

  return (
    <div className="w-full pt-16 flex gap-4 font-robotoMono">
      <div
        className="bg-[#2c2e31] py-24 w-full flex flex-col items-center rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]"
        onClick={() => {
          setIsCreateRoomOpen(true);
        }}
      >
        <Users size={38} strokeWidth={3} />
        Create Room
      </div>
      <div
        className="bg-[#2c2e31] py-24 w-full flex flex-col items-center rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]"
        onClick={() => {
          setIsJoinRoomOpen(true);
        }}
      >
        <CodeXml size={38} strokeWidth={3} />
        Join a Room
      </div>
      {isJoinRoomOpen && (
        <JoinRoom
          setIsPopupOpen={setIsJoinRoomOpen}
          userId={userId}
          wsConnection={wsConnection}
        />
      )}
      {isCreateRoomOpen && (
        <CreateRoom
          setIsPopupOpen={setIsCreateRoomOpen}
          userId={userId}
          wsConnection={wsConnection}
        />
      )}
    </div>
  );
});

export default Home;
