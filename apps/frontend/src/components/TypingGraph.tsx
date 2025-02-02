import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TypingState, wordDifficulty } from "../types";
import { processTypingData } from "../utils";

const TypingGraph = ({
  typingState,
  totalTime,
  difficulty,
}: {
  typingState: TypingState;
  totalTime: number;
  difficulty: wordDifficulty;
}) => {
  const typingData = processTypingData(typingState, totalTime);
  console.log(JSON.stringify(typingData, null, 2));

  return (
    <div className="w-full h-96 p-4 flex ">
      <div className=" pr-4 pt-7 flex flex-col gap-5">
        <div className="text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-textSecondary">
            wpm
          </h3>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryColor">
            {typingData?.totalWPM}
          </h1>
        </div>
        <div className="text-center">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-textSecondary">
            acc
          </h3>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primaryColor">
            {Math.round(
              (typingState.correctLetterCount /
                (typingState.correctLetterCount + typingState.errorCount)) *
                100
            )}
            %
          </h1>
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
  );
};

export default TypingGraph;
