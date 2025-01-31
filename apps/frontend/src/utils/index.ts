import { wordDifficulty } from "../types";
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
