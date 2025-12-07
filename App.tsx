
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
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" />
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
                  className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === 'evolution'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  Load Evolution
                </button>
                <button
                   onClick={() => setActiveTab('loads')}
                   className={`
                    whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === 'loads'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
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
