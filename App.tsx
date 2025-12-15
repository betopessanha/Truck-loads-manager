import React, { useState, useEffect, useCallback } from 'react';
import { type Load } from './types';
import { supabase, setSupabaseConfig } from './supabaseClient';
import { getWeekRange } from './utils/date';
import WeeklyReport from './components/WeeklyReport';
import LoadForm from './components/LoadForm';
import Modal from './components/Modal';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [loads, setLoads] = useState<Load[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLoad, setEditingLoad] = useState<Load | null>(null);

  // Configuration State for the fallback UI
  const [configUrl, setConfigUrl] = useState('');
  const [configKey, setConfigKey] = useState('');

  // 1. If Supabase is not configured, show the setup screen
  if (!supabase) {
    const handleSaveConfig = (e: React.FormEvent) => {
      e.preventDefault();
      if (!configUrl || !configKey) {
        alert("Please enter both URL and Key");
        return;
      }
      setSupabaseConfig(configUrl, configKey);
    };

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Connect to Supabase</h1>
            <p className="text-gray-500 mt-2 text-sm">Enter your project credentials to start managing loads.</p>
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project URL</label>
              <input 
                type="text" 
                value={configUrl}
                onChange={(e) => setConfigUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">API Key (Anon/Public)</label>
              <input 
                type="password" 
                value={configKey}
                onChange={(e) => setConfigKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors"
            >
              Connect App
            </button>
          </form>
          <div className="mt-6 text-xs text-gray-400 text-center">
            Credentials are saved locally in your browser.
          </div>
        </div>
      </div>
    );
  }

  const fetchLoads = useCallback(async (date: Date) => {
    setLoading(true);
    setError(null);

    const { start, end } = getWeekRange(date);

    try {
      const { data, error } = await supabase
        .from('loads')
        .select('*')
        .gte('pickupDate', start)
        .lte('pickupDate', end)
        .order('pickupDate', { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedData = data.map(load => ({
          ...load,
          timestamp: new Date(load.timestamp),
          pickupDate: new Date(load.pickupDate + 'T00:00:00'),
          deliveryDate: new Date(load.deliveryDate + 'T00:00:00'),
        }));
        setLoads(formattedData);
      }
    } catch (err: any) {
      console.error('Error fetching loads:', err);
      // Friendly error message for common issues
      if (err.message === 'Failed to fetch') {
        setError("Connection failed. Please check your internet or Supabase URL.");
      } else if (err.code === '42P01') {
        setError("Database table 'loads' not found. Please run the SQL setup script.");
      } else {
        setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLoads(currentDate);
  }, [currentDate, fetchLoads]);

  const handleAddLoad = async (load: Omit<Load, 'id' | 'timestamp'>) => {
    const { data, error } = await supabase
      .from('loads')
      .insert([load])
      .select()
      .single();

    if (error) {
      alert(`Failed to add load: ${error.message}`);
      throw error;
    }
    
    if (data) {
      fetchLoads(currentDate); // Refetch to show the new load if it's in the current week
      setIsFormOpen(false);
    }
  };

  const handleUpdateLoad = async (updatedLoad: Load) => {
    const { id, ...updateData } = updatedLoad;
    const { error } = await supabase
      .from('loads')
      .update(updateData)
      .eq('id', id);

    if (error) {
      alert(`Failed to update load: ${error.message}`);
      throw error;
    }
    
    fetchLoads(currentDate); // Refetch to show updated data
    setIsFormOpen(false);
    setEditingLoad(null);
  };
  
  const handleDeleteLoad = async (loadId: number) => {
    if (!window.confirm('Are you sure you want to delete this load?')) return;

    const { error } = await supabase.from('loads').delete().eq('id', loadId);

    if (error) {
      alert(`Failed to delete load: ${error.message}`);
    } else {
      fetchLoads(currentDate); // Refetch to remove the deleted load
    }
  };

  const handleOpenAddModal = () => {
    setEditingLoad(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (load: Load) => {
    setEditingLoad(load);
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 flex">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 z-10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 mr-3 text-blue-600">
                <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM22.5 13.5V6.375c0-1.035-.84-1.875-1.875-1.875h-.375a3 3 0 0 0-3-3H9.375a3 3 0 0 0-3 3H6c-1.036 0-1.875.84-1.875 1.875v7.125c0 .621.504 1.125 1.125 1.125h.375a3 3 0 0 1 5.25 0h.375a3 3 0 0 1 5.25 0h.375c.621 0 1.125-.504 1.125-1.125v-7.125Zm-18-3a.375.375 0 0 1 .375-.375h.375a.375.375 0 0 1 .375.375v.375h-.75V10.5Z" />
                <path d="M8.25 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM15.75 19.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
              </svg>
              Truck Load Manager
            </h1>
          </div>
        </header>

        <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {error && (
             <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r">
                <div className="flex">
                    <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                        {error.includes("table 'loads' not found") && (
                            <p className="text-xs text-red-500 mt-1">
                                Did you run the SQL script? Check the chat history for the <code>CREATE TABLE</code> command.
                            </p>
                        )}
                    </div>
                </div>
             </div>
          )}
          
          <WeeklyReport 
            loads={loads}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            loading={loading}
            error={null} // We handle error in parent now
            onAddLoad={handleOpenAddModal}
            onEditLoad={handleOpenEditModal}
            onDeleteLoad={handleDeleteLoad}
          />
        </main>
      </div>
      
      {isFormOpen && (
        <Modal title={editingLoad ? 'Edit Load' : 'Add New Load'} onClose={() => setIsFormOpen(false)}>
          <LoadForm 
            onAddLoad={handleAddLoad} 
            loadToEdit={editingLoad}
            onUpdateLoad={handleUpdateLoad}
            onCancelEdit={() => setIsFormOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default App;