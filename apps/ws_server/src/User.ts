import { WebSocket } from "ws";
// import { v4 as uuid } from "uuid";
import { RoomManager } from "./RoomManager";
import { generateRoomId } from "./utils";
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
          // if (
          //   !RoomManagerInstance.verifyIfUserNameExistInTheRoom(roomId, name)
          // ) {
          //   this.sendMessage({ type: "name-already-exist" });
          //   return;
          // }

          //check if the user is already present
          if (RoomManagerInstance.checkIfUserExistInTheRoom(roomId, userId)) {
            this.sendMessage({ type: "user-already-in-the-room" });
            return;
          }
          this.id = userId;
          this.roomId = roomId;
          this.name = name;
          this.displayName = RoomManagerInstance.addUserToRoom(roomId, this);

          this.sendMessage({
            type: "room-joined",
            payload: {
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
                useId: this.id,
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
              roomId: this.roomId,
              name: this.displayName,
              userId: this.id,
              isAdmin: this.isAdmin,
            },
          });
          break;
        }

        // case "VerifyIfUserNameExistInTheRoom":
        //   //do something
        //   const { roomId, name } = data.payload;

        //   RoomManager.getInstance().verifyIfUserNameExistInTheRoom(roomId, name)
        //     ? this.sendMessage({ type: "name-already-exist" })
        //     : this.sendMessage({ type: "name-doesnot-exist" });
        //   break;
      }
    });
  }
  destroy() {
    // do some thing
  }
  sendMessage(message: any) {
    this.ws.send(JSON.stringify(message));
  }
}
