import { useEffect, useState } from "react";
import { Users, CodeXml } from "lucide-react";
import Popup from "./Popup";

enum wsStatus {
  connected = "connected",
  loading = "loading",
  error = "error",
}

function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );

  useEffect(() => {
    const ws = new WebSocket("wss://localhost:3001");

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus(wsStatus.connected);
    };

    ws.onmessage = (event) => {
      console.log(event);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus(wsStatus.error);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
      if (connectionStatus !== "error") setConnectionStatus(wsStatus.error);
    };

    return () => {
      ws.close();
    };
  }, [connectionStatus]);

  if (connectionStatus === "error") {
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

  if (connectionStatus === "loading") {
    return (
      <div className="w-full p-28 flex flex-col items-center justify-center ">
        <p>Loading ...</p>
      </div>
    );
  }

  return (
    <div className="w-full pt-16 flex gap-4 font-robotoMono">
      <div className="bg-[#2c2e31] py-24 w-full flex flex-col items-center rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]">
        <Users size={38} strokeWidth={3} />
        Create Room
      </div>
      <div
        className="bg-[#2c2e31] py-24 w-full flex flex-col items-center rounded-lg hover:bg-textPrimary cursor-pointer hover:text-nav transition-colors duration-[150ms]"
        onClick={() => {
          setIsPopupOpen(true);
        }}
      >
        <CodeXml size={38} strokeWidth={3} />
        Join a Room
      </div>
      {isPopupOpen && <Popup setIsPopupOpen={setIsPopupOpen} />}
    </div>
  );
}

export default Home;
