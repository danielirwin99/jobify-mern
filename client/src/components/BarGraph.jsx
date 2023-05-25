import React from "react";
import {
  BarChart,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

const BarGraph = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#2cb1bc" barSize={75} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
