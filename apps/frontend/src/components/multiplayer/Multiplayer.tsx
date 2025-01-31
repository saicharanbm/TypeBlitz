import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import { firstUserPayload, roomDetailsType, wsStatus } from "../../types";
import { v4 as uuid } from "uuid";
import { toast } from "react-toastify";
import { ToastStlye } from "../../utils";
import Room from "./Room";
import ConnectionError from "./ConnectionError";

function Multiplayer() {
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );
  const [reloadCount, setReloadCount] = useState(0);
  const wsConnection = useRef<WebSocket | null>(null);
  // const [gameDetails, setGameDetails] = useState<gameDetails>({
  //   difficulty: wordDifficulty.easy,
  //   time: totalTime.sixty,
  // });
  const [roomDetails, setRoomDetails] = useState<roomDetailsType>();
  const userId = useRef(uuid());

  useEffect(() => {
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
              handleFirstUser(data.payload);
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
        setRoomDetails(undefined);
        userId.current = uuid();

        // Retry connection with exponential backoff
      };
    };

    connectWebSocket();

    return () => {
      if (wsConnection.current) {
        wsConnection.current.close();
      }
    };
  }, [reloadCount]);

  const handleFirstUser = (payload: firstUserPayload) => {
    const { roomId, name, userId, isAdmin, difficulty, progress, time } =
      payload;
    console.log(roomId, name, userId, isAdmin);
    if (
      !roomId ||
      !name ||
      !userId ||
      !difficulty ||
      !progress ||
      !time ||
      typeof isAdmin !== "boolean"
    ) {
      console.log("error");
      showToastError("Something went wrong while creating the room.");
      return;
    }
    showToastSuccess(`Room with id ${roomId} successfully created.`);

    setRoomDetails({
      roomId,
      difficulty,
      time,
      progress,
      users: [{ name, userId, isAdmin }],
      messages: [],
    });
  };

  const showToastError = (message: string) => {
    toast.dismiss();
    toast.error(message, ToastStlye);
  };
  const showToastSuccess = (message: string) => {
    toast.dismiss();
    toast.success(message, ToastStlye);
  };

  if (connectionStatus === wsStatus.error) {
    return (
      <ConnectionError
        reloadCount={reloadCount}
        setReloadCount={setReloadCount}
      />
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
    <Room />
  ) : (
    wsConnection.current && (
      <Home userId={userId.current} wsConnection={wsConnection.current} />
    )
  );
}

export default Multiplayer;
