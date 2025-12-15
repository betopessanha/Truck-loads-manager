import React from 'react';
import { type Load } from '../types';
import { getWeekRange, formatDateMMDDYYYY } from '../utils/date';

interface WeeklyReportProps {
  loads: Load[];
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  loading: boolean;
  error: string | null;
  onAddLoad: () => void;
  onEditLoad: (load: Load) => void;
  onDeleteLoad: (loadId: number) => void;
}

const SummaryCard: React.FC<{ title: string; value: string; color: string; subValue?: string }> = ({ title, value, color, subValue }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {subValue && <p className="text-xs text-gray-400 mt-1">{subValue}</p>}
  </div>
);

const StatusBadge: React.FC<{ status?: string }> = ({ status = 'Pending' }) => {
    let bg = 'bg-gray-100 text-gray-800';
    switch (status) {
        case 'In Transit': bg = 'bg-blue-100 text-blue-800'; break;
        case 'Delivered': bg = 'bg-yellow-100 text-yellow-800'; break;
        case 'Invoiced': bg = 'bg-purple-100 text-purple-800'; break;
        case 'Paid': bg = 'bg-green-100 text-green-800'; break;
    }
    return (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bg}`}>
            {status}
        </span>
    );
};

const WeeklyReport: React.FC<WeeklyReportProps> = ({ loads, currentDate, setCurrentDate, loading, error, onAddLoad, onEditLoad, onDeleteLoad }) => {

  const navigateWeek = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset * 7);
    setCurrentDate(newDate);
  };
  
  const goToCurrentWeek = () => {
    setCurrentDate(new Date());
  };

  const { start, end } = getWeekRange(currentDate);
  const weekLabel = `Week of ${new Date(start + 'T00:00:00').toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`;

  const summary = loads.reduce(
    (acc, load) => {
      acc.totalMiles += load.totalMiles;
      acc.totalRevenue += load.rate || 0;
      acc.totalFuel += load.fuelCost || 0;
      return acc;
    },
    { totalLoads: loads.length, totalMiles: 0, totalRevenue: 0, totalFuel: 0 }
  );

  const avgPerMile = summary.totalMiles > 0 ? summary.totalRevenue / summary.totalMiles : 0;
  const netProfit = summary.totalRevenue - summary.totalFuel;
  
  const formatCurrency = (value: number) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{weekLabel}</h2>
        </div>
        <div className="flex items-center gap-2">
            <button onClick={() => navigateWeek(-1)} className="px-3 py-1.5 border rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm">Prev</button>
            <button onClick={goToCurrentWeek} className="px-3 py-1.5 border rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm">Today</button>
            <button onClick={() => navigateWeek(1)} className="px-3 py-1.5 border rounded-md shadow-sm bg-white hover:bg-gray-50 text-sm">Next</button>
             <button onClick={onAddLoad} className="ml-4 px-4 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Add Load</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <SummaryCard title="Loads / Miles" value={`${summary.totalLoads}`} subValue={`${summary.totalMiles.toLocaleString()} mi`} color="text-gray-800" />
        <SummaryCard title="Gross Revenue" value={formatCurrency(summary.totalRevenue)} color="text-blue-600" />
        <SummaryCard title="Fuel Cost" value={formatCurrency(summary.totalFuel)} color="text-red-500" />
        <SummaryCard title="Net Profit" value={formatCurrency(netProfit)} color="text-green-600" />
        <SummaryCard title="Avg $/Mile" value={formatCurrency(avgPerMile)} color="text-orange-500" />
      </div>

      <div className="overflow-x-auto">
        {loading ? (
            <div className="text-center py-8">Loading...</div>
        ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
        ) : (
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Route / Broker</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Miles</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fuel/Net</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {loads.map(load => {
                        const net = (load.rate || 0) - (load.fuelCost || 0);
                        return (
                            <tr key={load.id} className="hover:bg-gray-50">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <StatusBadge status={load.status} />
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDateMMDDYYYY(load.pickupDate)}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{load.pickupLocation} ➜ {load.deliveryLocation}</div>
                                    <div className="text-xs text-gray-500">{load.brokerName || 'No Broker'}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {load.totalMiles.toLocaleString()}
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">{formatCurrency(load.rate || 0)}</td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-green-600">{formatCurrency(net)}</div>
                                    <div className="text-xs text-red-400">Fuel: {formatCurrency(load.fuelCost || 0)}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => onEditLoad(load)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                        <button onClick={() => onDeleteLoad(load.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )}
         { !loading && !error && loads.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                <p>No loads found for this week.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyReport;