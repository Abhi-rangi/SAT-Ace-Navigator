import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label
} from 'recharts';
import { Course } from '../types';

interface StatsChartProps {
  data: Course[];
}

export const StatsChart: React.FC<StatsChartProps> = ({ data }) => {
  if (data.length === 0) return null;

  // Transform data for chart
  const chartData = data.map(course => ({
    name: course.provider,
    price: course.price,
    score: course.averageScoreIncrease,
    fullName: course.name
  }));

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Value Analysis: Cost vs. Score Impact</h3>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" dataKey="price" name="Price" unit="$" stroke="#6b7280">
             <Label value="Price ($)" offset={-10} position="insideBottom" />
          </XAxis>
          <YAxis type="number" dataKey="score" name="Score Increase" unit=" pts" stroke="#6b7280">
             <Label value="Avg. Points Gained" angle={-90} position="insideLeft" />
          </YAxis>
          <Tooltip
            cursor={{ strokeDasharray: '3 3' }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-white p-3 border border-gray-200 shadow-lg rounded-lg">
                    <p className="font-bold text-indigo-900">{data.fullName}</p>
                    <p className="text-sm text-gray-600">Provider: {data.name}</p>
                    <p className="text-sm text-emerald-600">Price: ${data.price}</p>
                    <p className="text-sm text-orange-600">Avg Increase: {data.score} pts</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Scatter name="Courses" data={chartData} fill="#4f46e5" shape="circle" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
