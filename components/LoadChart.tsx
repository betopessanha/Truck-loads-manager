import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Load } from '../types';

interface LoadChartProps {
  loads: Load[];
}

interface SelectedMonthData {
  name: string;
  index: number;
  loads: Load[];
}

const LoadChart: React.FC<LoadChartProps> = ({ loads }) => {
  const availableYears = useMemo(() => {
    const years = new Set<number>(loads.map(load => load.pickupDate.getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
  }, [loads]);

  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears.length > 0 ? availableYears[0] : new Date().getFullYear()
  );
  
  const [selectedMonthData, setSelectedMonthData] = useState<SelectedMonthData | null>(null);

  useEffect(() => {
    if (availableYears.length > 0 && !availableYears.includes(selectedYear)) {
      setSelectedYear(availableYears[0]);
    } else if (availableYears.length === 0) {
      setSelectedYear(new Date().getFullYear());
    }
  }, [availableYears, selectedYear]);

  // Close summary view when year changes
  useEffect(() => {
    setSelectedMonthData(null);
  }, [selectedYear]);

  const chartData = useMemo(() => {
    const monthlyData: { [key: number]: { empty: number; loaded: number } } = {};

    for (let i = 0; i < 12; i++) {
      monthlyData[i] = { empty: 0, loaded: 0 };
    }

    loads
      .filter(load => load.pickupDate.getFullYear() === selectedYear)
      .forEach(load => {
        const month = load.pickupDate.getMonth(); // 0-11
        monthlyData[month].empty += load.emptyMiles;
        monthlyData[month].loaded += load.loadedMiles;
      });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return Object.keys(monthlyData).map(monthIndex => {
      const index = parseInt(monthIndex, 10);
      const data = monthlyData[index];
      return {
        name: monthNames[index],
        'Empty Miles': data.empty,
        'Loaded Miles': data.loaded,
      };
    });
  }, [loads, selectedYear]);
  
  const handleBarClick = (data: any) => {
    if (data && data.activePayload && data.activePayload.length > 0) {
      const monthName = data.activePayload[0].payload.name;
      // A reliable way to get month index from month name (e.g., "Jan" -> 0)
      const monthIndex = new Date(Date.parse(monthName +" 1, 2012")).getMonth();

      const filteredLoads = loads.filter(load =>
        load.pickupDate.getFullYear() === selectedYear &&
        load.pickupDate.getMonth() === monthIndex
      );

      // Only show summary if there are loads for that month
      if(filteredLoads.length > 0) {
          setSelectedMonthData({
              name: monthName,
              index: monthIndex,
              loads: filteredLoads,
          });
      }
    }
  };

  const handleYearChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(Number(event.target.value));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Load Evolution (Miles)</h2>
        {availableYears.length > 0 && (
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="mt-2 sm:mt-0 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        )}
      </div>

      {loads.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: -10,
                bottom: 5,
              }}
              onClick={handleBarClick}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
                }}
                formatter={(value: number, name) => [`${value.toLocaleString()} mi`, name]}
                cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
              />
              <Legend />
              <Bar dataKey="Empty Miles" stackId="a" fill="#f97316" cursor="pointer" />
              <Bar dataKey="Loaded Miles" stackId="a" fill="#22c55e" cursor="pointer" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex items-center justify-center h-72">
          <p className="text-gray-500">Add a load to see the evolution chart.</p>
        </div>
      )}

      {selectedMonthData && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              Load Summary for {selectedMonthData.name} {selectedYear}
            </h3>
            <button
              onClick={() => setSelectedMonthData(null)}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              Close
            </button>
          </div>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {selectedMonthData.loads.map(load => (
              <div key={load.id} className="bg-slate-50 p-3 rounded-md border border-gray-200">
                <p className="font-semibold text-gray-700 text-sm truncate">{load.pickupLocation} ➜ {load.deliveryLocation}</p>
                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                   <span>Load ID: {load.id}</span>
                   <span>{load.pickupDate.toLocaleDateString()} - {load.deliveryDate.toLocaleDateString()}</span>
                </div>
                <p className="text-right text-base font-bold text-blue-600 mt-2">{load.totalMiles.toLocaleString()} miles</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadChart;