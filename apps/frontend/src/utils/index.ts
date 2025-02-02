import { toast } from "react-toastify";
import {
  firstUserPayload,
  LetterDetailType,
  messageType,
  roomDetailsType,
  totalTime,
  TypingState,
  updateUserPayload,
  Users,
  wordDifficulty,
} from "../types";
import { wordsEasy, wordsMedium, wordsHard } from "./data";

export const ToastStlye = {
  style: {
    background: "#323437",
    color: "#d1d0c5",
    border: "1px solid #d1d0c5",
  }, // Custom background and text color
};
export const processTypingData = (typingState: TypingState) => {
  if (!typingState.startTimestamp || !typingState.endTimestamp) return [];

  const totalDuration =
    (typingState.endTimestamp - typingState.startTimestamp) / 1000; // in seconds
  const interval = 1; // 1-second intervals
  const totalIntervals = Math.ceil(totalDuration / interval);
  const time = Math.round(
    (typingState.endTimestamp - typingState.startTimestamp) / 1000
  );
  const result = {
    totalTime: time,
    totalWPM: typingState.correctLetterCount
      ? typingState.correctLetterCount / 5 / (time / 60)
      : 0,
    graphData: [],
  };
  const wpmData: { time: number; wpm: number; errors: number }[] = [];
  let correctLetters = 0;
  let errors = 0;

  for (let i = 0; i <= totalIntervals; i++) {
    const currentTime = typingState.startTimestamp + i * interval * 1000;

    // Filter letters typed up to current time
    const lettersSoFar = typingState.letterDetails.filter(
      (ld) => ld.timestamp <= currentTime
    );

    correctLetters = lettersSoFar.filter(
      (ld) => ld.type === LetterDetailType.correct
    ).length;
    errors = lettersSoFar.filter(
      (ld) =>
        ld.type === LetterDetailType.incorrect ||
        ld.type === LetterDetailType.extra
    ).length;

    const wordsTyped = correctLetters / 5;
    const wpm = (wordsTyped / (i + 1)) * 60; // WPM calculation

    wpmData.push({
      time: i + 1,
      wpm: Math.round(wpm),
      errors: errors,
    });
  }

  return wpmData;
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

export const handleFirstUser = (
  payload: firstUserPayload,
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >
) => {
  const { roomId, name, userId, isAdmin, difficulty, progress, time } = payload;

  if (
    !roomId ||
    !name ||
    !userId ||
    !difficulty ||
    !progress ||
    !time ||
    typeof isAdmin !== "boolean"
  ) {
    console.log("error");
    showToastError("Something went wrong while creating the room.");
    return;
  }
  showToastSuccess(`Room with id ${roomId} successfully created.`);

  setRoomDetails({
    roomId,
    difficulty,
    time,
    progress,
    users: [{ name, userId, isAdmin }],
    messages: [],
  });
};

export const updateUsers = (
  payload: updateUserPayload,
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >
) => {
  const { name, userId, isAdmin } = payload;
  console.log(payload);
  if (!name || !userId || typeof isAdmin !== "boolean") {
    showToastError("Something went wrong while adding users.");
    return;
  }

  setRoomDetails((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      users: [...prev.users, { name, userId, isAdmin }],
      messages: [
        ...prev.messages,
        {
          id: userId,
          message: "Joined the room.",
          name,
          type: messageType.update,
        },
      ],
    };
  });
};

export const addUserList = (
  payload: updateUserPayload[],
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >
) => {
  setRoomDetails((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      users: [...prev.users, ...payload],
    };
  });
};

export const deleteUser = (
  userId: string,
  name: string,
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >
) => {
  setRoomDetails((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      users: prev.users.filter((user) => user.userId !== userId),
      messages: [
        ...prev.messages,
        {
          id: userId,
          message: "Left the room.",
          name,
          type: messageType.update,
        },
      ],
    };
  });
};

export const updateRoomData = (
  payload: {
    difficulty: wordDifficulty;
    time: totalTime;
  },
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >
) => {
  const { difficulty, time } = payload;
  setRoomDetails((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      difficulty,
      time,
    };
  });
};

export const updateMessage = (
  payload: {
    message: string;
    userId: string;
    name: string;
  },
  setRoomDetails: React.Dispatch<
    React.SetStateAction<roomDetailsType | undefined>
  >
) => {
  const { message, userId, name } = payload;
  if (!message || !userId || !name) {
    return;
  }

  setRoomDetails((prev) => {
    if (!prev) return prev;
    return {
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: userId,
          message,
          name,
          type: messageType.message,
        },
      ],
    };
  });
};

export const showToastError = (message: string) => {
  toast.dismiss();
  toast.error(message, ToastStlye);
};
export const showToastSuccess = (message: string) => {
  toast.dismiss();
  toast.success(message, ToastStlye);
};
