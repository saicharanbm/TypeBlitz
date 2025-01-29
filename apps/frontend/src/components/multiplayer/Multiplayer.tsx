import { useEffect, useRef, useState } from "react";
import Home from "./Home";
// import JoinRoom from "./JoinRoom";
import { Link } from "react-router-dom";
import { wsStatus } from "../../types";
import { v4 as uuid } from "uuid";

function Multiplayer() {
  //   const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );
  const [reloadCount, setReloadCount] = useState(0);
  const wsConnection = useRef<WebSocket | null>(null);
  const [roomId, setRoomId] = useState("");
  const userId = useRef(uuid());

  useEffect(() => {
    wsConnection.current = new WebSocket("ws://localhost:3001");
    const ws = wsConnection.current;

    ws.onopen = () => {
      console.log("WebSocket connection established");
      setConnectionStatus(wsStatus.connected);
      ws.send(
        JSON.stringify({
          type: "connect",
          payload: {
            userId: userId.current,
          },
        })
      );
    };

    ws.onmessage = (response) => {
      console.log(typeof response.data);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setConnectionStatus(wsStatus.error);
    };

    ws.onclose = () => {
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
  }, [reloadCount]);

  if (connectionStatus === wsStatus.error) {
    return (
      <div className="w-full p-28 flex flex-col items-center justify-center ">
        {reloadCount < 4 ? (
          <>
            <p>
              Failed to connect to the WebSocket server. Please try again later.
            </p>
            <button
              onClick={() => setReloadCount((prev) => prev + 1)}
              className="mt-4 px-4 py-2 bg-nav rounded-lg  hover:bg-textPrimary hover:text-nav transition"
            >
              Reload Page
            </button>
          </>
        ) : (
          <>
            <p className="text-incorrect">
              Something went wrong please try again after some time.
            </p>
            <Link
              className="mt-4 px-4 py-2 bg-nav rounded-lg  hover:bg-textPrimary hover:text-nav transition"
              to={"/"}
            >
              Home
            </Link>
          </>
        )}
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
  if (!roomId && wsConnection.current) {
    return <Home userId={userId.current} wsConnection={wsConnection.current} />;
  }
}

export default Multiplayer;
