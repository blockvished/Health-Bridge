"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const data = [
  { name: "Basic", value: 54.5, color: "#36A2EB" },
  { name: "Premium", value: 45.5, color: "#5A47CE" },
];

const PlansByUserChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md" style={{ height: 'fit-content' }}>
      <h3 className="text-lg font-semibold mb-2">Plans by user</h3>
      <div style={{ width: '100%', height: 'auto', maxWidth: '300px', margin: '0 auto' }}> 
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PlansByUserChart;