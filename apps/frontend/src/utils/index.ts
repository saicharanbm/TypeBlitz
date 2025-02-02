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

    if (data.type === LetterDetailType.correct) {
      result.graphData[index].rawCount += 1;
      result.graphData[index].correctCount += 1;
    } else if (
      data.type === LetterDetailType.incorrect ||
      data.type === LetterDetailType.extra
    ) {
      result.graphData[index].rawCount += 1;
      result.graphData[index].errorCount += 1;
    }
  });

  result.graphData.forEach((element) => {
    element.correctWPM = (element.correctCount * 60) / 5;
    element.rawWPM = (element.rawCount * 60) / 5;
  });

  // Log final result in a more readable way
  console.log("Processed result:", JSON.stringify(result, null, 2));

  return result;
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
