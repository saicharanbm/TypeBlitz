import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import { roomDetailsType, wsStatus } from "../../types";
import { v4 as uuid } from "uuid";
import {
  addUserList,
  deleteUser,
  handleFirstUser,
  showToastError,
  updateMessage,
  updateRoomData,
  updateUsers,
} from "../../utils";
import Room from "./Room";
import ConnectionError from "./ConnectionError";

function Multiplayer() {
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );
  const [reloadCount, setReloadCount] = useState(0);
  const wsConnection = useRef<WebSocket | null>(null);

  const [roomDetails, setRoomDetails] = useState<roomDetailsType>();
  const userId = useRef(uuid());
  const connectWebSocket = () => {
    wsConnection.current = new WebSocket("ws://localhost:3001/");
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
            handleFirstUser(data.payload, setRoomDetails);
            break;
          case "user-joined":
            updateUsers(data.payload, setRoomDetails);
            break;
          case "user-left": {
            const { userId, name } = data.payload;
            deleteUser(userId, name, setRoomDetails);
            break;
          }
          case "message":
            updateMessage(data.payload, setRoomDetails);
            break;

          case "room-doesnot-exist":
            showToastError(
              `There is no room with the id ${data.payload.roomId}`
            );
            break;

          case "invalid-request": {
            const { message } = data.payload;

            showToastError(message || "Plesae provide all the details.");
            break;
          }

          case "user-already-in-the-room":
            showToastError("User has already joined the room.");
            break;
          case "user-list":
            addUserList(data.payload.users, setRoomDetails);
            break;
          case "room-details-update":
            updateRoomData(data.payload, setRoomDetails);
            break;
          case "room-closed":
            showToastError("Admin has left the room. Room closed.");
            break;
          case "game-status-start":
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
      connectWebSocket();

      // Retry connection with exponential backoff
    };
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (wsConnection.current) {
        wsConnection.current.close();
      }
    };
  }, [reloadCount]);

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

  return roomDetails?.roomId && wsConnection.current ? (
    <Room
      roomDetails={roomDetails}
      setRoomDetails={setRoomDetails}
      userId={userId.current}
      wsConnection={wsConnection.current}
    />
  ) : (
    wsConnection.current && (
      <Home userId={userId.current} wsConnection={wsConnection.current} />
    )
  );
}

export default Multiplayer;
