import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import { Link } from "react-router-dom";
import { roomDetailsType, wsStatus } from "../../types";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { ToastStlye } from "../../utils";

function Multiplayer() {
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );
  const [reloadCount, setReloadCount] = useState(0);
  const wsConnection = useRef<WebSocket | null>(null);
  const [roomDetails, setRoomDetails] = useState<roomDetailsType>();
  const userId = useRef(uuid());

  useEffect(() => {
    let reconnectTimeout: number | null = null;

    const connectWebSocket = () => {
      wsConnection.current = new WebSocket("ws://localhost:3001");
      const ws = wsConnection.current;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setConnectionStatus(wsStatus.connected);
        ws.send(
          JSON.stringify({
            type: "connect",
            payload: { userId: userId.current },
          })
        );
      };

      ws.onmessage = (response) => {
        try {
          const data = JSON.parse(response.data);
          console.log(data);

          switch (data.type) {
            case "room-created":
            case "room-joined":
              handleRoomUpdate(data.payload);
              break;

            case "room-doesnot-exist":
              showToastError(
                `There is no room with the id ${data.payload.roomId}`
              );
              break;

            case "invalid-request":
              showToastError("Please provide all the details.");
              break;

            case "user-already-in-the-room":
              showToastError("User has already joined the room.");
              break;

            default:
              console.warn("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionStatus(wsStatus.error);
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        if (connectionStatus !== wsStatus.error)
          setConnectionStatus(wsStatus.error);
        wsConnection.current = null;
        setRoomDetails(undefined);
        userId.current = uuid();

        // Retry connection with exponential backoff
        if (reloadCount < 4) {
          reconnectTimeout = setTimeout(
            () => {
              setReloadCount((prev) => prev + 1);
            },
            2000 * (reloadCount + 1)
          ); // 2s, 4s, 6s...
        }
      };
    };

    connectWebSocket();

    return () => {
      if (wsConnection.current) {
        wsConnection.current.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [reloadCount]);

  const handleRoomUpdate = (payload: any) => {
    const { roomId, name, userId, isAdmin } = payload;
    if (!roomId || !name || !userId || !isAdmin) {
      showToastError("Something went wrong while creating the room.");
      return;
    }
    toast.dismiss();
    toast.success(`Room with id ${roomId} successfully created.`, ToastStlye);

    setRoomDetails({
      roomId,
      users: [{ name, userId, isAdmin }],
      messages: [],
    });
  };

  const showToastError = (message: string) => {
    toast.dismiss();
    toast.error(message, ToastStlye);
  };

  if (connectionStatus === wsStatus.error) {
    return (
      <div className="w-full p-28 flex flex-col items-center justify-center">
        {reloadCount < 4 ? (
          <>
            <p>Failed to connect to the WebSocket server. Retrying...</p>
            <button
              onClick={() => setReloadCount((prev) => prev + 1)}
              className="mt-4 px-4 py-2 bg-nav rounded-lg hover:bg-textPrimary hover:text-nav transition"
            >
              Reload Page
            </button>
          </>
        ) : (
          <>
            <p className="text-incorrect">
              Something went wrong. Please try again later.
            </p>
            <Link
              className="mt-4 px-4 py-2 bg-nav rounded-lg hover:bg-textPrimary hover:text-nav transition"
              to="/"
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
      <div className="w-full p-28 flex flex-col items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return roomDetails?.roomId ? (
    <div>Room details: {JSON.stringify(roomDetails)}</div>
  ) : (
    wsConnection.current && (
      <Home userId={userId.current} wsConnection={wsConnection.current} />
    )
  );
}

export default Multiplayer;
