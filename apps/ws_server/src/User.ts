import { WebSocket } from "ws";
import { v4 as uuid } from "uuid";
import { RoomManager } from "./RoomManager";
export class User {
  public id: string;
  public roomId: string = "";
  public name: string = "";
  public wordCount: number = 0;
  public isAdmin: boolean;
  public ws: WebSocket;

  constructor(ws: WebSocket) {
    this.id = uuid();
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
          if (
            !RoomManagerInstance.verifyIfUserNameExistInTheRoom(roomId, name)
          ) {
            this.sendMessage({ type: "name-already-exist" });
            return;
          }
          this.roomId = roomId;
          this.name = name;
          RoomManagerInstance.addUserToRoom(roomId, this);

          //notify all the users
          RoomManager.getInstance().broadcastMessage(
            roomId,
            {
              type: "user-joined",
              payload: {
                name: this.name,
              },
            },
            this.id
          );
          break;
        }
        case "Create": {
          //do something
          const { roomId, name } = data.payload;

          // check if the Room is already present
          const RoomManagerInstance = RoomManager.getInstance();
          if (RoomManagerInstance.verifyIfRoomExist(roomId)) {
            this.sendMessage({ type: "room-already-exist" });
            return;
          }
          this.roomId = roomId;
          this.name = name;
          this.isAdmin = true;
          RoomManagerInstance.addUserToRoom(roomId, this);
          this.sendMessage({ type: "room-created" });
          break;
        }
        case "VerifyIfRoomExist": {
          //do something
          const { roomId } = data.payload;

          RoomManager.getInstance().verifyIfRoomExist(roomId)
            ? this.sendMessage({ type: "room-already-exist" })
            : this.sendMessage({ type: "room-doesnot-exist" });
          break;
        }
        case "VerifyIfUserNameExistInTheRoom":
          //do something
          const { roomId, name } = data.payload;

          RoomManager.getInstance().verifyIfUserNameExistInTheRoom(roomId, name)
            ? this.sendMessage({ type: "name-already-exist" })
            : this.sendMessage({ type: "name-doesnot-exist" });
          break;
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
