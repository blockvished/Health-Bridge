"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PlanData {
  name: string;
  count: number;
  color: string;
}

const data: PlanData[] = [
  { name: "Basic", count: 13, color: "#36A2EB" },
  { name: "Classic", count: 16, color: "#3586AF" },
  { name: "Premium", count: 10, color: "#5A47CE" },
];

const PlansByUserChart: React.FC = () => {
  const totalCount = data.reduce((sum, entry) => sum + entry.count, 0);

  const chartData = data.map((entry) => ({
    name: entry.name,
    value: (entry.count / totalCount) * 100,
    color: entry.color,
    count: entry.count, // Include count in chartData for legend
  }));

  return (
    <div className="bg-white p-6 rounded-lg" style={{ height: "fit-content" }}>
      <h3 className="text-lg font-semibold mb-2">Plans by user (Percentage)</h3>
      <div style={{ width: "100%", height: "auto", margin: "0 auto" }}>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              dataKey="value"
              label={({ name, value }) => `${name} ${typeof value === 'number' ? value.toFixed(2) : '0'}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => {
              if (typeof value === 'number') {
                return `${value.toFixed(2)}%`;
              }
              return '0%';
            }} />
            <Legend formatter={(value, entry, index) => {
              const item = chartData[index];
              return `${item.name} (${item.count})`;
            }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlansByUserChart;