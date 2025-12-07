
import React, { useState, useEffect } from 'react';
import { type Load } from '../types';
import AutocompleteInput from './AutocompleteInput';
import { usCities } from '../data/cities';

interface LoadFormProps {
  onAddLoad: (load: Omit<Load, 'id' | 'timestamp'>) => void;
}

const LoadForm: React.FC<LoadFormProps> = ({ onAddLoad }) => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [emptyMiles, setEmptyMiles] = useState('');
  const [loadedMiles, setLoadedMiles] = useState('');
  const [totalMiles, setTotalMiles] = useState(0);
  const [isLocating, setIsLocating] = useState(false);

  useEffect(() => {
    const empty = Number(emptyMiles) || 0;
    const loaded = Number(loadedMiles) || 0;
    setTotalMiles(empty + loaded);
  }, [emptyMiles, loadedMiles]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Could not get location. Check your browser permissions.");
          setIsLocating(false);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentLocation || !pickupLocation || !deliveryLocation || !emptyMiles || !loadedMiles) {
      alert('Please fill in all fields.');
      return;
    }
    onAddLoad({
      currentLocation,
      pickupLocation,
      deliveryLocation,
      emptyMiles: Number(emptyMiles),
      loadedMiles: Number(loadedMiles),
      totalMiles,
    });
    // Reset form
    setCurrentLocation('');
    setPickupLocation('');
    setDeliveryLocation('');
    setEmptyMiles('');
    setLoadedMiles('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Load</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700">Current Location</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <AutocompleteInput
              id="currentLocation"
              value={currentLocation}
              onChange={setCurrentLocation}
              suggestions={usCities}
              placeholder="Ex: Chicago, IL"
              wrapperClassName="flex-1"
              inputClassName="bg-white focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 pl-3 pr-10 py-2"
            />
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-sm hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              {isLocating ? (
                <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700">Pickup Location</label>
           <AutocompleteInput
            id="pickupLocation"
            value={pickupLocation}
            onChange={setPickupLocation}
            suggestions={usCities}
            placeholder="Ex: Port of Long Beach, CA"
          />
        </div>

        <div>
          <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700">Delivery Location</label>
          <AutocompleteInput
            id="deliveryLocation"
            value={deliveryLocation}
            onChange={setDeliveryLocation}
            suggestions={usCities}
            placeholder="Ex: Warehouse in Phoenix, AZ"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emptyMiles" className="block text-sm font-medium text-gray-700">Empty Miles</label>
              <input
                type="number"
                id="emptyMiles"
                value={emptyMiles}
                onChange={(e) => setEmptyMiles(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="50"
              />
            </div>
            <div>
              <label htmlFor="loadedMiles" className="block text-sm font-medium text-gray-700">Loaded Miles</label>
              <input
                type="number"
                id="loadedMiles"
                value={loadedMiles}
                onChange={(e) => setLoadedMiles(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="250"
              />
            </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-md text-center">
            <p className="text-sm font-medium text-blue-800">Total Miles</p>
            <p className="text-3xl font-bold text-blue-600">{totalMiles}</p>
        </div>

        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Add Load
        </button>
      </form>
    </div>
  );
};

export default LoadForm;
