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
  //   if (data && data.graphData) {
  //     return (
  //       <div className="bg-nav text-textPrimary rounded-md flex flex-col gap-4">
  //         {data.graphData.map((details, id) => (
  //           <div key={id} className="flex flex-col gap-2">
  //             <span>Time : {details.time}</span>
  //             <span>Correct Count : {details.correctCount}</span>
  //             <span>Correct WPM : {details.correctWPM}</span>
  //             <span>Raw Count : {details.rawCount}</span>
  //             <span>Raw WPM : {details.rawWPM}</span>
  //             <span>Error Count : {details.errorCount}</span>

  //             {/* <div>{JSON.stringify(details, null, 2)}</div> */}
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   }
  return (
    // <div className="w-full h-96">
    //   <ResponsiveContainer width="100%" height="100%">
    //     <LineChart data={data}>
    //       <CartesianGrid strokeDasharray="3 3" />
    //       <XAxis
    //         dataKey="time"
    //         label={{
    //           value: "Time (s)",
    //           position: "insideBottomRight",
    //           offset: 0,
    //         }}
    //       />
    //       <YAxis
    //         label={{ value: "Count", angle: -90, position: "insideLeft" }}
    //       />
    //       <Tooltip />
    //       <Legend />
    //       <Line
    //         type="monotone"
    //         dataKey="correctCount"
    //         stroke="#4caf50"
    //         strokeWidth={2}
    //         name="Correct"
    //       />
    //       <Line
    //         type="monotone"
    //         dataKey="rawCount"
    //         stroke="#2196f3"
    //         strokeWidth={2}
    //         name="Total Typed"
    //       />
    //       <Line
    //         type="monotone"
    //         dataKey="errorCount"
    //         stroke="#f44336"
    //         strokeWidth={2}
    //         name="Errors"
    //       />
    //     </LineChart>
    //   </ResponsiveContainer>
    // </div>
    // <div>Some thing went wrong</div>
    <div className="w-full h-96 p-4 flex ">
      <div className=" pr-4  pt-5 flex flex-col justify-between">
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
            {typingData?.totalWPM}
          </h1>
        </div>
        <div className="text-base md:text-lg  text-center">
          <p className=" text-textSecondary">test type</p>
          <p className="text-primaryColor">time {totalTime}</p>
          <p className="text-primaryColor inline-block">
            difficulty {difficulty}
          </p>
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
            <h3>consistency</h3>
            <h1 className="md:text-3xl text-primaryColor">{`${40}%`}</h1>
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
