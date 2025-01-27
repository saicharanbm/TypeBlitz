import { words } from "./data";
export const getRandomWord = (): string => {
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};
