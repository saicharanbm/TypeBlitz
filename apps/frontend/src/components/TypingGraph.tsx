import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { TypingState } from "../types";
import { processTypingData } from "../utils";

const TypingGraph = ({
  typingState,
  totalTime,
}: {
  typingState: TypingState;
  totalTime: number;
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
    <div className="w-full h-64 bg-gray-900 p-4 rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={typingData?.graphData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="time" stroke="#bbb" />
          <YAxis
            yAxisId="left"
            label={{
              value: "Words per Minute",
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
          <Tooltip contentStyle={{ backgroundColor: "#222", border: "none" }} />
          <Legend verticalAlign="top" height={36} />

          {/* Correct WPM Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="correctWPM"
            stroke="#FFD700"
            strokeWidth={2}
            dot={false}
            name="Correct WPM"
          />

          {/* Raw WPM Line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="rawWPM"
            stroke="#8884d8"
            strokeWidth={2}
            dot={false}
            name="Raw WPM"
          />

          {/* Error Points */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="errorCount"
            stroke="#FF4C4C"
            strokeWidth={2}
            dot={{ r: 4 }}
            name="Errors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TypingGraph;
