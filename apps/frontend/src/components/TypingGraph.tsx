import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { TypingState } from "../types";
import { processTypingData } from "../utils";

const TypingGraph = ({ typingState }: { typingState: TypingState }) => {
  const data = processTypingData(typingState);

  return (
    <div className="w-full h-64">
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          label={{
            value: "Time (s)",
            position: "insideBottomRight",
            offset: -5,
          }}
        />
        <YAxis
          yAxisId="left"
          label={{ value: "WPM", angle: -90, position: "insideLeft" }}
        />
        <YAxis
          yAxisId="right"
          orientation="right"
          label={{ value: "Errors", angle: 90, position: "insideRight" }}
        />

        <Tooltip />
        <Legend />

        {/* WPM Line */}
        <Line
          yAxisId="left"
          type="monotone"
          dataKey="wpm"
          stroke="#FFD700"
          strokeWidth={2}
        />

        {/* Errors Line */}
        <Line
          yAxisId="right"
          type="monotone"
          dataKey="errors"
          stroke="#FF4C4C"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </LineChart>
    </div>
  );
};

export default TypingGraph;
