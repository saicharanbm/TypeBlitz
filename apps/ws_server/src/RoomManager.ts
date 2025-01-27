import { User } from "./User";
interface roomData {
  users: User[];
  words: string;
}
export class RoomManager {
  rooms: Map<string, roomData> = new Map<string, roomData>();
  private static instance: RoomManager = new RoomManager();
  private constructor() {}
  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }
  removeUserFromRoom(roomId: string, userId: string) {
    const data = this.rooms.get(roomId);
    if (data) {
      this.rooms.set(roomId, {
        users: data.users.filter((u) => u.id !== userId),
        words: data.words,
      });
    }
  }
  verifyIfRoomExist(roomId: string): boolean {
    if (this.rooms.has(roomId)) return true;
    return false;
  }
  verifyIfUserNameExistInTheRoom(roomId: string, name: string): boolean {
    const data = this.rooms.get(roomId);

    return data?.users ? data.users.some((user) => user.name === name) : false;
  }

  addUserToRoom(roomId: string, user: User) {
    const data = this.rooms.get(roomId);
    const users = data?.users;
    if (users) {
      this.rooms.set(roomId, { users: [...users, user], words: data.words });
    } else {
      //generate words
      const words = "";
      this.rooms.set(roomId, { users: [user], words });
    }
  }
  broadcastMessage(roomId: string, message: any, userId: string) {
    const data = this.rooms.get(roomId);
    const users = data?.users;
    if (users) {
      users.forEach((user) => {
        if (user.id !== userId) {
          user.sendMessage(message);
        }
      });
    }
  }
}
