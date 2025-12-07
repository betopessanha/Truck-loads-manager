
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Load } from '../types';

interface LoadChartProps {
  loads: Load[];
}

const LoadChart: React.FC<LoadChartProps> = ({ loads }) => {
  const chartData = loads.map((load, index) => ({
    name: `Load #${index + 1}`,
    'Total Miles': load.totalMiles,
    'Empty Miles': load.emptyMiles,
    'Loaded Miles': load.loadedMiles,
    date: load.pickupDate.toLocaleDateString(),
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Load Evolution (Miles)</h2>
       {loads.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 20,
                  left: -10,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0"/>
                <XAxis dataKey="name" stroke="#6b7280"/>
                <YAxis stroke="#6b7280"/>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number, name) => [`${value.toLocaleString()} mi`, name]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                        return <span className="font-bold">{`${label} (${payload[0].payload.date})`}</span>
                    }
                    return label
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Empty Miles" stroke="#f97316" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Loaded Miles" stroke="#22c55e" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Total Miles" stroke="#3b82f6" strokeWidth={2} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
        </div>
       ) : (
          <div className="flex items-center justify-center h-72">
            <p className="text-gray-500">Add a load to see the evolution chart.</p>
          </div>
       )}
    </div>
  );
};

export default LoadChart;
