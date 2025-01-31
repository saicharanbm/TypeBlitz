import { useId } from "react";
import { Users, wordDifficulty } from "../types";
import { wordsEasy, wordsMedium, wordsHard } from "./data";

export const ToastStlye = {
  style: {
    background: "#323437",
    color: "#d1d0c5",
    border: "1px solid #d1d0c5",
  }, // Custom background and text color
};

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
export const isUserAdmin = (userId: string, users: Users[]) => {
  console.log(userId, users);
  const adminUser = users.find((user) => user.isAdmin);
  return adminUser ? adminUser.userId === userId : false;
};
