import { User } from "./User";
import { generateRoomId, getRandomWord } from "./utils";
interface roomData {
  users: User[];
  words: string[];
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
  checkIfUserExistInTheRoom(roomId: string, userId: string): boolean {
    const data = this.rooms.get(roomId);

    return data?.users ? data.users.some((user) => user.id === userId) : false;
  }

  getAllUsers(roomId: string, userId: string) {
    const users = this.rooms.get(roomId)?.users;
    const usersList = users
      ?.filter((user) => user.id !== userId)
      ?.map((user) => ({
        userId: user.id,
        name: user.displayName,
        isAdmin: user.isAdmin,
      }));
    return usersList ?? [];
  }

  addUserToRoom(roomId: string, user: User) {
    const data = this.rooms.get(roomId);
    const users = data?.users;
    let name = user.name;
    if (users) {
      this.rooms.set(roomId, { users: [...users, user], words: data.words });
      //get the count of users with same name in the room
      const count = this.rooms.get(roomId)?.users.reduce((acc, user) => {
        return user.name === name ? acc + 1 : acc;
      }, 0);
      name = count && count > 1 ? `${name} (${count})` : name;
    }
    // else {
    //   //generate words
    //   const words = Array.from({ length: 200 }, (_, id) => {
    //     const word = getRandomWord();
    //     return id === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    //   });

    //   this.rooms.set(roomId, { users: [user], words });
    // }
    return name;
  }

  createRoom(user: User) {
    const roomId = generateRoomId();
    const words = Array.from({ length: 200 }, (_, id) => {
      const word = getRandomWord();
      return id === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    });

    this.rooms.set(roomId, { users: [user], words });
    return roomId;
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
