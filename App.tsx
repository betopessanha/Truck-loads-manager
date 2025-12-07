
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
      pickupDate: new Date('2025-05-12T12:00:00Z'),
      deliveryDate: new Date('2025-06-12T12:00:00Z'),
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
      pickupDate: new Date('2025-06-12T12:00:00Z'),
      deliveryDate: new Date('2025-07-12T12:00:00Z'),
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
      pickupDate: new Date('2025-07-12T12:00:00Z'),
      deliveryDate: new Date('2025-10-12T12:00:00Z'),
    },
  ]);
  const [activeTab, setActiveTab] = useState<'evolution' | 'loads'>('loads');


  const addLoad = (load: Omit<Load, 'id' | 'timestamp'>) => {
    setLoads(prevLoads => {
      const newId = prevLoads.length > 0 ? Math.max(...prevLoads.map(l => parseInt(l.id))) + 1 : 1;
      const newLoad: Load = {
        ...load,
        id: String(newId),
        timestamp: new Date(),
      };
      return [...prevLoads, newLoad];
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-3 text-blue-600">
              <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM22.5 13.5V6.375c0-1.035-.84-1.875-1.875-1.875h-.375a3 3 0 0 0-3-3H9.375a3 3 0 0 0-3 3H6c-1.036 0-1.875.84-1.875 1.875v7.125c0 .621.504 1.125 1.125 1.125h.375a3 3 0 0 1 5.25 0h.375a3 3 0 0 1 5.25 0h.375c.621 0 1.125-.504 1.125-1.125v-7.125Zm-18-3a.375.375 0 0 1 .375-.375h.375a.375.375 0 0 1 .375.375v.375h-.75V10.5Z" />
              <path d="M8.25 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15.75 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
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
              <nav className="-mb-px flex space-x-4 sm:space-x-8" aria-label="Tabs">
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
