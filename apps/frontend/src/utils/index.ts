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
export const processTypingData = (
  typingState: TypingState,
  totalDuration: number
) => {
  if (
    !typingState.startTimestamp ||
    !typingState.endTimestamp ||
    totalDuration <= 0
  ) {
    console.log("Invalid input data:", { typingState, totalDuration });
    return;
  }

  const result = {
    totalTime: totalDuration,
    totalWPM: typingState.correctLetterCount
      ? typingState.correctLetterCount / 5 / (totalDuration / 60)
      : 0,
    graphData: Array.from({ length: totalDuration }).map((_, id) => ({
      time: id + 1,
      correctCount: 0,
      rawCount: 0,
      errorCount: 0,
      correctWPM: 0,
      rawWPM: 0,
    })),
  };

  // Log input data in a more readable way
  console.log("Input typing state:", JSON.stringify(typingState, null, 2));

  typingState.letterDetails.forEach((data) => {
    const currentTime = Math.ceil(data.timestamp / 1000);
    const index = Math.min(currentTime, totalDuration) - 1;

    if (
      data.type === LetterDetailType.correct ||
      data.type === LetterDetailType.next
    ) {
      result.graphData[index].rawCount += 1;
      result.graphData[index].correctCount += 1;
      return;
    }
    result.graphData[index].rawCount += 1;
    result.graphData[index].errorCount += 1;
  });
  let previousCount = 0;
  result.graphData.forEach((element, index) => {
    element.correctWPM = Math.round(
      ((element.correctCount + previousCount) * 60) / (index + 1) / 5
    );
    element.rawWPM = Math.round((element.rawCount * 60) / 5);

    previousCount += element.correctCount;
  });

  // Log final result in a more readable way
  console.log("Processed result:", JSON.stringify(result, null, 2));

  return result;
};
export const generateReplayWords = (
  words: string[],
  typingData: TypingState
) => {
  let counter = 1;
  let maxCounter = 1;

  typingData.letterDetails.forEach((detail) => {
    if (detail.type === LetterDetailType.next) {
      counter++;
    } else if (detail.type === LetterDetailType.previous) {
      counter = Math.max(1, counter - 1);
    }

    if (counter > maxCounter) {
      maxCounter = counter;
    }
  });

  const updatedWords = words.slice(0, maxCounter);
  return updatedWords;
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

export const scrollUpOneLine = (
  gameRef: React.RefObject<HTMLDivElement>,
  setLineOffset: React.Dispatch<React.SetStateAction<number>>,
  focusLetterCount: React.MutableRefObject<number>
) => {
  const lineHeight = 48;

  gameRef.current?.focus();
  setLineOffset((prev) => prev + lineHeight);
  focusLetterCount.current = Math.round(focusLetterCount.current / 2);
};
