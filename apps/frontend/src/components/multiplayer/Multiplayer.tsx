import { useEffect, useRef, useState } from "react";
import { Users, CodeXml } from "lucide-react";
import JoinRoom from "./JoinRoom";
import { wsStatus } from "../../types";

function Multiplayer() {
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );
  const wsConnection = useRef<WebSocket | null>(null);

  useEffect(() => {
    wsConnection.current = new WebSocket("ws://localhost:3001");

    wsConnection.current.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus(wsStatus.connected);
    };

    wsConnection.current.onmessage = (event) => {
      console.log(event);
    };

    wsConnection.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus(wsStatus.error);
    };

    wsConnection.current.onclose = () => {
      console.log("WebSocket connection closed");
      if (connectionStatus !== wsStatus.error)
        setConnectionStatus(wsStatus.error);
    };

    // Cleanup WebSocket on unmount
    return () => {
      if (wsConnection.current) {
        wsConnection.current.close();
        wsConnection.current = null;
      }
    };
  }, []);

  if (connectionStatus === wsStatus.error) {
    return (
      <div className="w-full p-28 flex flex-col items-center justify-center ">
        <p>
          Failed to connect to the WebSocket server. Please try again later.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-nav rounded-lg  hover:bg-textPrimary hover:text-nav transition"
        >
          Reload Page
        </button>
      </div>
    );
  }

  if (connectionStatus === wsStatus.loading) {
    return (
      <div className="w-full p-28 flex flex-col items-center justify-center ">
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-16 flex gap-4 font-robotoMono">
      <div
        className="bg-[#2c2e31] py-24 w-full flex flex-col items-center rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]"
        onClick={() => {
          // Add room creation logic here
          console.log("Create Room clicked");
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
      {isJoinRoomOpen && <JoinRoom setIsPopupOpen={setIsJoinRoomOpen} />}
    </div>
  );
}

export default Multiplayer;
