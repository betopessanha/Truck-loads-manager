
import React, { useState } from 'react';
import LoadForm from './components/LoadForm';
import LoadList from './components/LoadList';
import LoadChart from './components/LoadChart';
import { type Load } from './types';

const App: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([
    // Initial sample data
    {
      id: '1',
      currentLocation: 'New York, NY',
      pickupLocation: 'Philadelphia, PA',
      deliveryLocation: 'Washington, DC',
      emptyMiles: 95,
      loadedMiles: 135,
      totalMiles: 230,
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      pickupDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
    {
      id: '2',
      currentLocation: 'Los Angeles, CA',
      pickupLocation: 'Las Vegas, NV',
      deliveryLocation: 'Phoenix, AZ',
      emptyMiles: 270,
      loadedMiles: 300,
      totalMiles: 570,
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      pickupDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      deliveryDate: new Date(),
    },
    {
      id: '3',
      currentLocation: 'Boston, MA',
      pickupLocation: 'Springfield, MA',
      deliveryLocation: 'Phoenix, AZ',
      emptyMiles: 50,
      loadedMiles: 1500,
      totalMiles: 1550,
      timestamp: new Date(), // Today
      pickupDate: new Date(),
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    },
  ]);
  const [activeTab, setActiveTab] = useState<'evolution' | 'loads'>('evolution');


  const addLoad = (load: Omit<Load, 'id' | 'timestamp'>) => {
    const newLoad: Load = {
      ...load,
      id: new Date().toISOString(),
      timestamp: new Date(),
    };
    setLoads(prevLoads => [...prevLoads, newLoad]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              <path d="M17.36 8.44a1 1 0 00-1.14-.26l-3.3 1.65a1 1 0 00-.62 1.1v4.34a1 1 0 001 1h2a1 1 0 001-1v-5.23a1 1 0 00-.3-.7zM15 14h-1v-3.3l2-1v4.3z" />
            </svg>
            Truck Load Manager
          </h1>
          <p className="text-gray-600 mt-1">Manage your truck loads efficiently</p>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <LoadForm onAddLoad={addLoad} />
          </div>
          <div className="lg:col-span-2">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('evolution')}
                  className={`${
                    activeTab === 'evolution'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Load Evolution
                </button>
                <button
                   onClick={() => setActiveTab('loads')}
                  className={`${
                    activeTab === 'loads'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  aria-current={activeTab === 'loads' ? 'page' : undefined}
                >
                  Issued Loads
                </button>
              </nav>
            </div>
            <div className="mt-8">
              {activeTab === 'evolution' && <LoadChart loads={loads} />}
              {activeTab === 'loads' && <LoadList loads={loads} />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;