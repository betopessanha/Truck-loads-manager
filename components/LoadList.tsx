import React from 'react';
import { type Load } from '../types';

interface LoadListProps {
  loads: Load[];
  onEdit: (load: Load) => void;
  onDelete: (loadId: number) => void;
}

const LoadList: React.FC<LoadListProps> = ({ loads, onEdit, onDelete }) => {
  const formatDate = (date: Date): string => {
    // Manually construct date string to guarantee MM/DD/YYYY format, avoiding locale issues.
    // getFullYear(), getMonth(), and getDate() use the browser's local timezone, which is correct
    // because the initial Date object was created from a string in the local timezone.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  const formatDateRange = (start: Date, end: Date) => {
    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">Issued Loads</h2>
      <div className="space-y-4">
        {loads.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No loads added yet.</p>
        ) : (
          loads.map((load) => (
            <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <div className='flex-1 min-w-0'>
                  <p className="font-semibold text-base sm:text-lg text-blue-700 truncate">{load.pickupLocation} ➜ {load.deliveryLocation}</p>
                  <p className="text-xs text-gray-500 mt-1 truncate">Load ID: {load.id}</p>
                  {load.reference && (
                     <p className="text-xs text-gray-500 mt-1 truncate">Ref: {load.reference}</p>
                  )}
                </div>
                <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
                  <div className="flex items-center text-sm text-gray-500 whitespace-nowrap">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002 2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span>{formatDateRange(load.pickupDate, load.deliveryDate)}</span>
                  </div>
                  <button
                    onClick={() => onEdit(load)}
                    className="p-1 rounded-full text-gray-400 hover:text-blue-600 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    aria-label="Edit load"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(load.id)}
                    className="p-1 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                    aria-label="Delete load"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Empty Miles</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-500">{load.emptyMiles.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Loaded Miles</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">{load.loadedMiles.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Miles</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{load.totalMiles.toLocaleString()}</p>
                </div>
              </div>
               {load.currentLocation && (
                <div className="mt-4 text-sm text-gray-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>Started at: <strong>{load.currentLocation}</strong></span>
                </div>
               )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoadList;