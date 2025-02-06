import { WebSocket } from "ws";
// import { v4 as uuid } from "uuid";
import { RoomManager } from "./RoomManager";
import { generateRoomId, isDifficulty, isTotalTime } from "./utils";
import { gameProgress, totalTime, TypingState, wordDifficulty } from "./types";
export class User {
  id: string = "";
  roomId: string = "";
  name: string = "";
  displayName: string = "";
  status: "idle" | "playing" | "finished" = "idle";
  typingState: TypingState = {
    startTimestamp: null,
    endTimestamp: null,
    letterDetails: [],
    correctLetterCount: 0,
    errorCount: 0,
  };

  isAdmin: boolean = false;
  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;

    this.handleRequests();
  }

  handleRequests() {
    this.ws.on("message", (request) => {
      const data = JSON.parse(request.toString());

      switch (data.type) {
        case "Join": {
          //do something
          const { roomId, name, userId } = data.payload;
          if (!roomId.trim() || !name.trim() || !userId.trim()) {
            this.sendMessage({
              type: "invalid-request",
              payload: { message: "Please provide all the details." },
            });
            return;
          }
          const RoomManagerInstance = RoomManager.getInstance();
          if (!RoomManagerInstance.verifyIfRoomExist(roomId)) {
            this.sendMessage({
              type: "room-doesnot-exist",
              payload: { roomId },
            });
            return;
          }

          //check if the user is already present
          if (RoomManagerInstance.checkIfUserExistInTheRoom(roomId, userId)) {
            this.sendMessage({ type: "user-already-in-the-room" });
            return;
          }

          const response = RoomManagerInstance.addUserToRoom(
            roomId,
            this,
            name
          );
          if (!response) {
            return;
          }
          this.id = userId;
          this.roomId = roomId;
          this.name = name;
          this.displayName = response.name;

          this.sendMessage({
            type: "room-joined",
            payload: {
              ...response,
              roomId: this.roomId,
              name: this.displayName,
              userId: this.id,
              isAdmin: this.isAdmin,
            },
          });
          //send the list of exesting users
          const userList = RoomManagerInstance.getAllUsers(
            this.roomId,
            this.id
          );
          this.sendMessage({
            type: "user-list",
            payload: {
              users: userList,
            },
          });

          //notify all the users
          RoomManager.getInstance().broadcastMessage(
            roomId,
            {
              type: "user-joined",
              payload: {
                name: this.displayName,
                userId: this.id,
                isAdmin: this.isAdmin,
              },
            },
            this.id
          );
          break;
        }
        case "Create": {
          console.log("Create request");
          //do something
          const { userId, name } = data.payload;
          if (!userId.trim() || !name.trim()) {
            this.sendMessage({
              type: "invalid-request",
              payload: { message: "Please provide all the details." },
            });
            return;
          }
          this.id = userId;
          this.name = name;
          this.isAdmin = true;
          this.displayName = name;
          const RoomManagerInstance = RoomManager.getInstance();

          // this.roomId = generateRoomId();
          this.roomId = RoomManagerInstance.createRoom(this);

          this.sendMessage({
            type: "room-created",
            payload: {
              difficulty: wordDifficulty.easy,
              time: totalTime.sixty,
              progress: gameProgress.waiting,
              roomId: this.roomId,
              name: this.displayName,
              userId: this.id,
              isAdmin: this.isAdmin,
            },
          });
          break;
        }
        case "message": {
          const { message } = data.payload;
          if (message.trim()) {
            RoomManager.getInstance().broadcastMessage(
              this.roomId,
              {
                type: "message",
                payload: {
                  userId: this.id,
                  name: this.displayName,
                  message,
                },
              },
              this.id
            );
          }
          break;
        }
        case "update-room-details": {
          const { time, difficulty } = data.payload;
          if (isDifficulty(difficulty) && isTotalTime(time)) {
            const RoomManagerInstance = RoomManager.getInstance();
            RoomManagerInstance.updateRoomDetails(
              this.roomId,
              time,
              difficulty
            );
            RoomManagerInstance.broadcastMessage(
              this.roomId,
              {
                type: "room-details-update",
                payload: {
                  time,
                  difficulty,
                },
              },
              this.id
            );

            return;
          }
          this.sendMessage({
            type: "invalid-request",
            payload: { message: "Please provide all the details." },
          });
          break;
        }
        case "start-game": {
          const RoomManagerInstance = RoomManager.getInstance();
          if (!this.isAdmin) {
            this.sendMessage({
              type: "invalid-request",
              payload: { message: "You are not authorized to start game." },
            });
            return;
          }

          //change the progress from waiting to starting

          RoomManagerInstance.startGame(this.roomId, this);

          break;
        }
        case "handle-Key-down": {
          const { key, wordIndex, letterIndex } = data.payload;
          if (
            !key ||
            typeof wordIndex !== "number" ||
            typeof letterIndex !== "number" ||
            wordIndex < 0 ||
            wordIndex >= 400 ||
            letterIndex < 0
          )
            return;
          console.log(this.status);
          if (this.status !== "playing") return;

          const RoomManagerInstance = RoomManager.getInstance();
          RoomManagerInstance.handleKeyDown(
            this.roomId,
            this.id,
            key,
            wordIndex,
            letterIndex
          );
          break;
        }
        case "update-GameStatus": {
          const { type } = data.payload;
          if (type !== "playing" && type !== "finished") return;
          if (type === "playing") {
            this.status = type;
            return;
          }
          RoomManager.getInstance().updateUserStatus(this.roomId, this.id);
          console.log("update game status", type);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  destroy() {
    // do some thing

    const RoomManagerInstance = RoomManager.getInstance();
    const progress = RoomManagerInstance.rooms.get(this.roomId)?.progress;
    if (this.isAdmin && progress === gameProgress.waiting) {
      RoomManagerInstance.deleteRoom(this.roomId, this.id);
      this.ws.close();
      return;
    }
    RoomManagerInstance.removeUserFromRoom(this.roomId, this.id);
    RoomManagerInstance.broadcastMessage(
      this.roomId!,
      {
        type: "user-left",
        payload: {
          userId: this.id,
          name: this.displayName,
        },
      },
      this.id
    );

    //close the websocket
    this.ws.close();
  }
  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}
