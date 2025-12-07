
import React from 'react';
import { type Load } from '../types';

interface LoadListProps {
  loads: Load[];
}

const LoadList: React.FC<LoadListProps> = ({ loads }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Issued Loads</h2>
      <div className="space-y-4">
        {loads.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No loads added yet.</p>
        ) : (
          [...loads].reverse().map((load) => (
            <div key={load.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-3">
                <p className="font-semibold text-lg text-blue-700">{load.pickupLocation} ➜ {load.deliveryLocation}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1 sm:mt-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  <span>{load.pickupDate.toLocaleDateString()} - {load.deliveryDate.toLocaleDateString()}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Empty Miles</p>
                  <p className="text-2xl font-bold text-orange-500">{load.emptyMiles.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Loaded Miles</p>
                  <p className="text-2xl font-bold text-green-500">{load.loadedMiles.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total Miles</p>
                  <p className="text-2xl font-bold text-blue-600">{load.totalMiles.toLocaleString()}</p>
                </div>
              </div>
               <div className="mt-4 text-sm text-gray-600 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Started at: <strong>{load.currentLocation}</strong></span>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoadList;
