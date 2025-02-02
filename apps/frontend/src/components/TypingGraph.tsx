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
  const data = processTypingData(typingState, totalTime);

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="time"
            label={{
              value: "Time (s)",
              position: "insideBottomRight",
              offset: 0,
            }}
          />
          <YAxis
            label={{ value: "Count", angle: -90, position: "insideLeft" }}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="correctCount"
            stroke="#4caf50"
            strokeWidth={2}
            name="Correct"
          />
          <Line
            type="monotone"
            dataKey="rawCount"
            stroke="#2196f3"
            strokeWidth={2}
            name="Total Typed"
          />
          <Line
            type="monotone"
            dataKey="errorCount"
            stroke="#f44336"
            strokeWidth={2}
            name="Errors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TypingGraph;
