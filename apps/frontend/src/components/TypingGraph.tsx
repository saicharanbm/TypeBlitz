import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { TypingState, wordDifficulty } from "../types";
import { processTypingData } from "../utils";
import { Rewind, RotateCw } from "lucide-react";
import { useState } from "react";
import Replay from "./Replay";
const TypingGraph = ({
  words,
  typingState,
  totalTime,
  difficulty,
  initializeGame,
}: {
  words: string[];
  typingState: TypingState;
  totalTime: number;
  difficulty: wordDifficulty;
  initializeGame: () => void;
}) => {
  const [showReplay, setShowReplay] = useState(false);
  const typingData = processTypingData(typingState, totalTime);

  if (typingData) {
    return (
      <div className="w-full py-6 md:py-8 lg-py-12 flex flex-col gap-2">
        <div className="w-full h-96 p-4 flex ">
          <div className=" pr-4 pt-7 flex flex-col gap-5">
            <div className="text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-textSecondary">
                wpm
              </h3>
              <h1 className=" wpm text-3xl md:text-4xl lg:text-5xl font-bold text-primaryColor">
                {Math.round(typingData.totalWPM)}
              </h1>
              <ReactTooltip anchorSelect=".wpm" place="top">
                <p>{typingData.totalWPM.toFixed(2)} wpm</p>
              </ReactTooltip>
            </div>
            <div className="text-center">
              <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-textSecondary">
                acc
              </h3>
              <h1 className="acc text-3xl md:text-4xl lg:text-5xl font-bold text-primaryColor">
                {Math.round(
                  (typingState.correctLetterCount /
                    (typingState.correctLetterCount + typingState.errorCount)) *
                    100
                )}
                %
              </h1>
              <ReactTooltip anchorSelect=".acc" place="top">
                <p>
                  {(
                    (typingState.correctLetterCount /
                      (typingState.correctLetterCount +
                        typingState.errorCount)) *
                    100
                  ).toFixed(2)}{" "}
                  %
                </p>
                <p>{typingState.correctLetterCount} correct</p>
                <p>{typingState.errorCount} incorrect</p>
              </ReactTooltip>
            </div>
          </div>
          <div className="w-full flex flex-col">
            <ResponsiveContainer width="100%" height="85%">
              <LineChart
                data={typingData?.graphData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="1" stroke="#444" />
                <XAxis dataKey="time" stroke="#bbb" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: "Wpm",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#bbb",
                  }}
                  stroke="#bbb"
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: "Errors",
                    angle: 90,
                    position: "insideRight",
                    fill: "#bbb",
                  }}
                  stroke="#bbb"
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#2c2e31", border: "none" }}
                />
                {/* <Legend verticalAlign="top" height={36} /> */}

                {/* Raw WPM Line */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rawWPM"
                  stroke="#656669"
                  strokeWidth={3}
                  dot={false}
                  name="Raw WPM"
                />
                {/* Correct WPM Line */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="correctWPM"
                  stroke="#FFD700"
                  strokeWidth={3}
                  dot={false}
                  name="Correct WPM"
                />

                {/* Error Points */}
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="errorCount"
                  stroke="#FF4C4C"
                  strokeWidth={0.5}
                  dot={false}
                  name="Errors"
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="w-full h-auto flex justify-around ">
              <div className="text-center">
                <h3>characters</h3>
                <h1 className="md:text-3xl text-primaryColor">{`${typingState.correctLetterCount + typingState.errorCount}/${typingState.correctLetterCount}/${typingState.errorCount}`}</h1>
              </div>
              <div className="text-center">
                <h3>type</h3>
                <h1 className="md:text-3xl text-primaryColor">{difficulty}</h1>
              </div>
              <div className="text-center">
                <h3>time</h3>
                <h1 className="md:text-3xl text-primaryColor">{totalTime}</h1>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full  md:p-12  flex items-center justify-center gap-4">
          <RotateCw
            className="text-textSecondary cursor-pointer hover:text-textPrimary transition-colors duration-[150ms]"
            onClick={initializeGame}
            size={28}
            strokeWidth={3}
          />
          <Rewind
            className="text-textSecondary cursor-pointer hover:text-textPrimary transition-colors duration-[150ms]"
            onClick={() => setShowReplay((prev) => !prev)}
            size={28}
            strokeWidth={3}
          />
        </div>
        {showReplay && (
          <Replay
            words={words}
            typingData={typingState}
            totalTime={totalTime}
            graphData={typingData.graphData}
          />
        )}
      </div>
    );
  }
  return <div className="w-full p-28">Some thing went wrong...</div>;
};

export default TypingGraph;
