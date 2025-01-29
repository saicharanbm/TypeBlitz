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
          const { roomId, name } = data.payload;
          const RoomManagerInstance = RoomManager.getInstance();
          if (!RoomManagerInstance.verifyIfRoomExist(roomId)) {
            this.sendMessage({ type: "room-doesnott-exist" });
            return;
          }
          // if (
          //   !RoomManagerInstance.verifyIfUserNameExistInTheRoom(roomId, name)
          // ) {
          //   this.sendMessage({ type: "name-already-exist" });
          //   return;
          // }
          this.roomId = roomId;
          this.name = name;
          this.displayName = RoomManagerInstance.addUserToRoom(roomId, this);

          this.sendMessage({
            type: "room-joined",
            payload: {
              roomId: this.roomId,
              name: this.displayName,
              userId: this.id,
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

          const RoomManagerInstance = RoomManager.getInstance();

          this.roomId = generateRoomId();

          this.displayName = RoomManagerInstance.addUserToRoom(
            this.roomId,
            this
          );
          this.sendMessage({
            type: "room-created",
            payload: {
              roomId: this.roomId,
              name: this.displayName,
              userId: this.id,
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
