import { User } from "./User";
export class RoomManager {
  rooms: Map<string, User[]> = new Map<string, User[]>();
  private static instance: RoomManager = new RoomManager();
  private constructor() {}
  static getInstance() {
    if (!RoomManager.instance) {
      RoomManager.instance = new RoomManager();
    }
    return RoomManager.instance;
  }
  removeUserFromSpace(roomId: string, user: User) {
    const users = this.rooms.get(roomId);
    if (users) {
      this.rooms.set(
        roomId,
        users.filter((u) => u.id !== user.id)
      );
    }
  }
  verifyIfRoomExist(roomId: string): boolean {
    if (this.rooms.has(roomId)) return true;
    return false;
  }
  verifyIfUserNameExistInTheRoom(roomId: string, userId: string): boolean {
    const users = this.rooms.get(roomId);

    return users ? users.some((user) => user.id === userId) : false;
  }

  addUserToSpace(roomId: string, user: User) {
    const users = this.rooms.get(roomId);
    if (users) {
      this.rooms.set(roomId, [...users, user]);
    } else {
      this.rooms.set(roomId, [user]);
    }
  }
  broadcastMessage(roomId: string, message: any, user: User) {
    const users = this.rooms.get(roomId);
    if (users) {
      users.forEach((u) => {
        if (u.id !== user.id) {
          u.sendMessage(message);
        }
      });
    }
  }
}
