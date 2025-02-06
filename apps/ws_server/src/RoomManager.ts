import { User } from "./User";
import { generateRoomId, getRandomWord } from "./utils";
import {
  gameProgress,
  LetterDetailType,
  roomDetails,
  totalTime,
  wordDifficulty,
} from "./types";

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
      roomData.words = Array.from({ length: 400 }, (_, id) => {
        return getRandomWord(difficulty);
      });
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

  startGame(roomId: string, user: User) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    //invalidate the request if there is only one user in the room
    if (room.users.length < 2) {
      user.sendMessage({
        type: "invalid-request",
        payload: {
          message: "There should be atleast 2 people in the room.",
        },
      });
      return;
    }
    room.progress = gameProgress.starting;

    room.startTime = Date.now() + 5000;
    room.endTime = room.startTime + room.time * 1000;
    this.broadcastMessage(roomId, {
      type: "game-status-start",
      payload: {
        message: "The game starts in 5 seconds!",
        words: room.words,
        startTime: room.startTime,
        endTime: room.endTime,
      },
    });
  }
  announceResult(roomId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    if (!room.startTime || !room.endTime) return;

    const usersTypingState = room.users.map((user) => {
      return {
        userId: user.id,
        name: user.displayName,
        typingState: {
          ...user.typingState,
          endTimestamp: room.endTime,
          startTimestamp: room.startTime,
        },
      };
    });

    this.broadcastMessage(roomId, {
      type: "game-finished",
      payload: { usersTypingState },
    });
    return;
  }

  handleKeyDown(
    roomId: string,
    userId: string,
    key: string,
    currentWordIndex: number,
    currentLetterIndex: number
  ) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    if (!room.startTime || !room.endTime) return;
    //check if the game is active
    const currentTime = Date.now();
    if (room.progress! === gameProgress.playing || currentTime < room.startTime)
      return;

    if (currentTime > room.endTime) {
      room.progress = gameProgress.finished;
      this.announceResult(roomId);
      return;
    }

    const user = room.users.find((u) => u.id === userId);
    if (!user) return;
    // console.log("handling key down", key);

    const currentWord = room.words[currentWordIndex];
    const timestamp = currentTime - room.startTime;

    if (!currentWord) {
      return;
    }
    const currentLetter = currentWord[currentLetterIndex];

    const addEventToLetterDetails = (
      key: string,
      type: LetterDetailType,
      isCorrect: boolean
    ) => {
      const event = {
        letter: key,
        type,
        timestamp,
      };

      user.typingState.letterDetails.push(event);
      if (isCorrect) {
        user.typingState.correctLetterCount++;
      } else {
        user.typingState.errorCount++;
      }
    };
    // Handle space key
    if (key === " ") {
      if (currentLetterIndex >= currentWord.length) {
        // user.sendMessage({ type: "next-word" });
        addEventToLetterDetails("Space", LetterDetailType.next, true);
      } else {
        // user.sendMessage({ type: "wrong-letter" });
        addEventToLetterDetails("Space", LetterDetailType.incorrect, false);
      }
      return;
    }

    // Handle backspace key
    if (key === "Backspace") {
      if (currentLetterIndex === 0) {
        if (currentWordIndex > 0) {
          // user.sendMessage({ type: "previous-word" });
          addEventToLetterDetails(
            "BackSpace",
            LetterDetailType.previous,
            false
          );
        } else {
          return;
        }
      } else if (currentLetterIndex <= currentWord.length) {
        // user.sendMessage({ type: "remove-letter" });
        addEventToLetterDetails("BackSpace", LetterDetailType.remove, false);
      } else {
        // user.sendMessage({ type: "remove-extra-letter" });
        addEventToLetterDetails(
          "BackSpace",
          LetterDetailType.removeExtra,
          false
        );
      }

      return;
    }

    // Handle normal letter input
    if (currentLetterIndex >= currentWord.length) {
      // user.sendMessage({ type: "extra-letter" });
      addEventToLetterDetails(key, LetterDetailType.extra, false);
    } else if (currentLetter === key) {
      // user.sendMessage({ type: "correct-letter" });
      addEventToLetterDetails(key, LetterDetailType.correct, true);
    } else {
      // user.sendMessage({ type: "wrong-letter" });
      addEventToLetterDetails(key, LetterDetailType.incorrect, false);
    }
  }

  updateUserStatus(roomId: string, userId: string) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return;
    }
    const user = room.users.find((u) => u.id === userId);
    if (!user) return;
    if (!room.startTime || !room.endTime) return;
    if (room.progress !== gameProgress.finished && Date.now() >= room.endTime) {
      room.progress = gameProgress.finished;
      this.announceResult(roomId);
      return;
    }
    user.status = "finished";
  }

  createRoom(user: User) {
    const roomId = generateRoomId();
    const words = Array.from({ length: 400 }, (_, id) => {
      return getRandomWord(wordDifficulty.easy);
    });
    const data: roomDetails = {
      words,
      time: totalTime.sixty,
      difficulty: wordDifficulty.easy,
      users: [user],
      progress: gameProgress.waiting,
    };

    this.rooms.set(roomId, data);
    return roomId;
  }

  broadcastMessage(roomId: string, message: any, userId?: string) {
    const data = this.rooms.get(roomId);
    const users = data?.users;
    if (users) {
      if (userId && userId.trim()) {
        users.forEach((user) => {
          if (user.id !== userId) {
            user.sendMessage(message);
          }
        });
        return;
      }
      users.forEach((user) => {
        user.sendMessage(message);
      });
    }
  }
}
