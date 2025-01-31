import { WebSocket } from "ws";
// import { v4 as uuid } from "uuid";
import { RoomManager } from "./RoomManager";
import { generateRoomId, isDifficulty, isTotalTime } from "./utils";
import { gameProgress, totalTime, wordDifficulty } from "./types";
export class User {
  id: string = "";
  roomId: string = "";
  name: string = "";
  displayName: string = "";
  wordCount: number = 0;
  correctWordCount: number = 0;
  isAdmin: boolean;
  ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.isAdmin = false;
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
            this.sendMessage({
              type: "invalid-request",
              payload: { message: "Please provide all the details." },
            });
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
        case "leave-room": {
          break;
        }
      }
    });
  }
  destroy() {
    // do some thing

    const RoomManagerInstance = RoomManager.getInstance();
    if (this.isAdmin) {
      RoomManagerInstance.deleteRoom(this.roomId, this.id);
      this.ws.close();
      return;
    }
    RoomManagerInstance.broadcastMessage(
      this.roomId!,
      {
        type: "user-left",
        payload: {
          userId: this.id,
        },
      },
      this.id
    );
    RoomManagerInstance.removeUserFromRoom(this.roomId, this.id);

    //close the websocket
    this.ws.close();
  }
  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}
