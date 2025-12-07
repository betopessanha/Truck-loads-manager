import React, { useState, useEffect } from 'react';
import LoadForm from './components/LoadForm';
import LoadList from './components/LoadList';
import LoadChart from './components/LoadChart';
import { type Load } from './types';
import { supabase } from './supabaseClient';

// Helper function to reliably format a Date object to a 'YYYY-MM-DD' string
// based on the user's local timezone, avoiding UTC conversion issues.
const formatForSupabase = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const App: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [activeTab, setActiveTab] = useState<'evolution' | 'loads'>('loads');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);

  // If Supabase isn't configured, show a helpful message instead of crashing.
  if (!supabase) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Configuration Required</h1>
          <p className="text-gray-700 mb-2">
            The application cannot connect to the database because the Supabase environment variables are missing.
          </p>
          <p className="text-gray-700 mb-6">
            Please configure the following secrets for your project:
          </p>
          <div className="text-left bg-gray-100 p-4 rounded-md font-mono text-sm text-gray-800">
            <p><span className="font-semibold">SUPABASE_URL</span> = <span className="text-gray-500">"Your Supabase Project URL"</span></p>
            <p className="mt-2"><span className="font-semibold">SUPABASE_ANON_KEY</span> = <span className="text-gray-500">"Your Supabase Anon Key"</span></p>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            You can find these values in your Supabase project dashboard under <span className="font-semibold">Settings &gt; API</span>.
          </p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const fetchLoads = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching loads:', error);
        setError('Failed to fetch loads. Please check your Supabase configuration and RLS policies.');
      } else if (data) {
        // Convert date strings from Supabase to Date objects, ensuring correct timezone handling.
        // Appending T00:00:00 treats the date string as local, preventing UTC conversion shifts.
        const formattedData = data.map(load => ({
          ...load,
          timestamp: new Date(load.timestamp),
          pickupDate: new Date(load.pickupDate + 'T00:00:00'),
          deliveryDate: new Date(load.deliveryDate + 'T00:00:00'),
        }));
        setLoads(formattedData);
      }
      setLoading(false);
    };

    fetchLoads();
  }, []);

  const addLoad = async (load: Omit<Load, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase
      .from('loads')
      .insert([
        {
          ...load,
          pickupDate: formatForSupabase(load.pickupDate),
          deliveryDate: formatForSupabase(load.deliveryDate),
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding load:', error);
      alert('Failed to add load.');
      throw error; // Re-throw to be caught in the form
    } 
    
    if (data) {
      const newLoad = {
        ...data,
        timestamp: new Date(data.timestamp),
        pickupDate: new Date(data.pickupDate + 'T00:00:00'),
        deliveryDate: new Date(data.deliveryDate + 'T00:00:00'),
      };
      setLoads(prevLoads => [newLoad, ...prevLoads]);
    }
  };

  const handleStartEdit = (load: Load) => {
    setEditingLoad(load);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingLoad(null);
  };

  const handleUpdateLoad = async (updatedLoad: Load) => {
    const { data, error } = await supabase
      .from('loads')
      .update({
        // Omit id and timestamp from the update payload, they shouldn't change
        currentLocation: updatedLoad.currentLocation,
        pickupLocation: updatedLoad.pickupLocation,
        deliveryLocation: updatedLoad.deliveryLocation,
        emptyMiles: updatedLoad.emptyMiles,
        loadedMiles: updatedLoad.loadedMiles,
        totalMiles: updatedLoad.totalMiles,
        pickupDate: formatForSupabase(updatedLoad.pickupDate),
        deliveryDate: formatForSupabase(updatedLoad.deliveryDate),
        reference: updatedLoad.reference,
      })
      .eq('id', updatedLoad.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating load:', error);
      alert('Failed to update load.');
      throw error;
    }

    if (data) {
      const freshLoad = {
        ...data,
        timestamp: new Date(data.timestamp),
        pickupDate: new Date(data.pickupDate + 'T00:00:00'),
        deliveryDate: new Date(data.deliveryDate + 'T00:00:00'),
      };
      setLoads(loads.map(l => l.id === freshLoad.id ? freshLoad : l));
      setEditingLoad(null); // Exit edit mode
    }
  };

  const handleDeleteLoad = async (loadId: number) => {
    if (!window.confirm('Are you sure you want to delete this load?')) {
      return;
    }

    const { error } = await supabase
      .from('loads')
      .delete()
      .eq('id', loadId);

    if (error) {
      console.error('Error deleting load:', error);
      alert(`Failed to delete load: ${error.message}`);
    } else {
      setLoads(loads.filter(load => load.id !== loadId));
    }
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
            <LoadForm 
              onAddLoad={addLoad} 
              loadToEdit={editingLoad}
              onUpdateLoad={handleUpdateLoad}
              onCancelEdit={handleCancelEdit}
            />
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
              {activeTab === 'loads' && (
                loading ? (
                  <div className="flex justify-center items-center h-48"><p className="text-gray-500">Loading loads...</p></div>
                ) : error ? (
                  <div className="flex justify-center items-center h-48"><p className="text-red-500 font-medium">{error}</p></div>
                ) : (
                  <LoadList loads={loads} onEdit={handleStartEdit} onDelete={handleDeleteLoad} />
                )
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;