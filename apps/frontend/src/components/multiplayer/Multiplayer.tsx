import { useEffect, useRef, useState } from "react";
import Home from "./Home";
import { GameState, letterType, roomDetailsType, wsStatus } from "../../types";
import { v4 as uuid } from "uuid";
import {
  addUserList,
  deleteUser,
  handleFirstUser,
  showToastError,
  showToastSuccess,
  updateMessage,
  updateRoomData,
  updateUsers,
} from "../../utils";
import Room from "./Room";
import ConnectionError from "./ConnectionError";
import GameArea from "./GameArea";

function Multiplayer() {
  const [connectionStatus, setConnectionStatus] = useState<wsStatus>(
    wsStatus.loading
  );
  const [reloadCount, setReloadCount] = useState(0);
  const wsConnection = useRef<WebSocket | null>(null);
  const [roomDetails, setRoomDetails] = useState<roomDetailsType>();
  const roomDetailsRef = useRef<roomDetailsType>();
  const [gameData, setGameData] = useState<GameState>();
  const [timer, setTimer] = useState<number>(10);
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
          case "game-status-start": {
            const { message, words } = data.payload;
            initializeGame(words);
            showToastSuccess(message);
            break;
          }
          case "countdown": {
            const { secondsLeft } = data.payload;
            if (secondsLeft) setTimer(secondsLeft);
            break;
          }
          case "game-status-play": {
            setGameData((prev) => {
              if (!prev) return;
              return {
                ...prev,
                gameStatus: "playing",
              };
            });
            break;
          }
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
      setGameData(undefined);
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

  // Update the ref whenever roomDetails changes as this will let us access roomDetails inside the ws closure
  useEffect(() => {
    roomDetailsRef.current = roomDetails;
  }, [roomDetails]);

  const initializeGame = (words: string[]): void => {
    const currentRoomDetails = roomDetailsRef.current;
    console.log("Current room details from ref:", currentRoomDetails);

    if (!currentRoomDetails) return;

    const newWords = words.map((word) =>
      word.split("").map((letter) => ({ letter, type: letterType.normal }))
    );

    setGameData({
      words: newWords,
      originalWords: words,
      currentWordIndex: 0,
      currentLetterIndex: 0,
      gameStatus: "waiting",
      timeLeft: currentRoomDetails.time,
      focus: true,
      wpm: 0,
    });
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
  if (gameData && wsConnection.current) {
    return (
      <GameArea
        gameData={gameData}
        setGameData={setGameData}
        timer={timer}
        wsConnection={wsConnection.current}
        totalTime={roomDetails?.time || 60}
      />
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
