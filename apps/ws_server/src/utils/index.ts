import { RoomManager } from "../RoomManager";
import { roomIdString, wordsEasy, wordsMedium, wordsHard } from "./data";
import { wordDifficulty } from "../types";

export const getRandomWord = (wordType: wordDifficulty): string => {
  const words =
    wordType === wordDifficulty.easy
      ? wordsEasy
      : wordType === wordDifficulty.medium
        ? wordsMedium
        : wordsHard;
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

export const generateRoomId = () => {
  const len = roomIdString.length;
  const maxRetries = 100; // Prevent infinite loop
  let roomId = "";

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    roomId = Array.from(
      { length: 6 },
      () => roomIdString[Math.floor(Math.random() * len)]
    ).join("");
    if (!RoomManager.getInstance().verifyIfRoomExist(roomId)) {
      return roomId;
    }
  }

  throw new Error(
    "Unable to generate a unique room ID after multiple attempts"
  );
};
