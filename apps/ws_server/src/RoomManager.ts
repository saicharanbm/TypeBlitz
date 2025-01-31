import { User } from "./User";
import { generateRoomId, getRandomWord } from "./utils";
import { gameProgress, roomDetails, totalTime, wordDifficulty } from "./types";

export class RoomManager {
  rooms: Map<string, roomDetails> = new Map<string, roomDetails>();
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
        ...data,
        users: data.users.filter((u) => u.id !== userId),
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

  updateRoomDetails(
    roomId: string,
    time: totalTime,
    difficulty: wordDifficulty
  ) {
    const roomData = this.rooms.get(roomId);
    if (roomData) {
      roomData.difficulty = difficulty;
      roomData.time = time;
    }
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

  addUserToRoom(roomId: string, user: User, userName: string) {
    const data = this.rooms.get(roomId);
    if (!data || Object.keys(data).length === 0) return;
    const users = data?.users;
    let name = userName;
    console.log(name);
    if (users) {
      this.rooms.set(roomId, {
        ...data,
        users: [...users, user],
        words: data.words,
      });

      //get the count of users with same name in the room
      const count = this.rooms.get(roomId)?.users.reduce((acc, user) => {
        return user.name === name ? acc + 1 : acc;
      }, 0);
      name = count && count > 0 ? `${name} (${count})` : name;
    }
    console.log(name);
    const response = {
      name,
      difficulty: data.difficulty,
      progress: data.progress,
      time: data.time,
    };

    return response;
  }

  deleteRoom(roomId: string, userId: string) {
    const data = this.rooms.get(roomId);
    //notify all the users that the room has closed and delete the users
    this.broadcastMessage(roomId, { type: "room-closed" }, userId);
    data?.users.forEach((user) => user.ws.close());
    this.rooms.delete(roomId);
  }

  createRoom(user: User) {
    const roomId = generateRoomId();
    const words = Array.from({ length: 200 }, (_, id) => {
      const word = getRandomWord(wordDifficulty.easy);
      return id === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word;
    });
    const data: roomDetails = {
      words,
      time: totalTime.sixty,
      roomId,
      difficulty: wordDifficulty.easy,
      users: [user],
      progress: gameProgress.waiting,
    };

    this.rooms.set(roomId, data);
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
