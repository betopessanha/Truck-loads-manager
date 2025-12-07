import React, { useState, useEffect } from 'react';
import { type Load } from '../types';
import AutocompleteInput from './AutocompleteInput';
import DatePickerInput from './DatePickerInput';
import { usCities } from '../data/cities';
import { getDistanceFromLatLonInMiles } from '../utils/distance';

interface LoadFormProps {
  onAddLoad: (load: Omit<Load, 'id' | 'timestamp'>) => Promise<void>;
  loadToEdit: Load | null;
  onUpdateLoad: (load: Load) => Promise<void>;
  onCancelEdit: () => void;
}

const formatDateForInput = (date: Date): string => {
  // Formats a Date object into "YYYY-MM-DD" string required by input[type="date"]
  // by using local date parts to avoid timezone shifts.
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const DateShortcuts = ({ setDate }: { setDate: (date: string) => void }) => {
  const today = new Date();

  const shortcuts = [
    { label: 'Today', days: 0 },
    { label: 'Tomorrow', days: 1 },
    { label: '+3 Days', days: 3 },
  ];

  const handleShortcutClick = (days: number) => {
    const targetDate = new Date();
    targetDate.setDate(today.getDate() + days);
    setDate(formatDateForInput(targetDate));
  };

  return (
    <div className="flex space-x-2 mt-2">
      {shortcuts.map(({ label, days }) => (
        <button
          key={label}
          type="button"
          onClick={() => handleShortcutClick(days)}
          className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
        >
          {label}
        </button>
      ))}
    </div>
  );
};

const LoadForm: React.FC<LoadFormProps> = ({ onAddLoad, loadToEdit, onUpdateLoad, onCancelEdit }) => {
  const [currentLocation, setCurrentLocation] = useState('');
  const [pickupLocation, setPickupLocation] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [reference, setReference] = useState('');
  const [emptyMiles, setEmptyMiles] = useState('');
  const [loadedMiles, setLoadedMiles] = useState('');
  const [totalMiles, setTotalMiles] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditMode = !!loadToEdit;

  const cityNames = usCities.map(city => city.name);

  const resetForm = () => {
    setCurrentLocation('');
    setPickupLocation('');
    setDeliveryLocation('');
    setPickupDate(formatDateForInput(new Date()));
    setDeliveryDate(formatDateForInput(new Date()));
    setReference('');
  };

  useEffect(() => {
    if (loadToEdit) {
      setCurrentLocation(loadToEdit.currentLocation);
      setPickupLocation(loadToEdit.pickupLocation);
      setDeliveryLocation(loadToEdit.deliveryLocation);
      setPickupDate(formatDateForInput(loadToEdit.pickupDate));
      setDeliveryDate(formatDateForInput(loadToEdit.deliveryDate));
      setReference(loadToEdit.reference || '');
      setEmptyMiles(String(loadToEdit.emptyMiles));
      setLoadedMiles(String(loadToEdit.loadedMiles));
    } else {
      resetForm();
    }
  }, [loadToEdit]);

  useEffect(() => {
    const empty = Number(emptyMiles) || 0;
    const loaded = Number(loadedMiles) || 0;
    setTotalMiles(empty + loaded);
  }, [emptyMiles, loadedMiles]);

  useEffect(() => {
    // If current location is not provided, empty miles are 0.
    if (!currentLocation) {
      setEmptyMiles('0');
      return;
    }

    const getCoords = (locationName: string) => usCities.find(c => c.name === locationName);

    let startCoords: { latitude: number; longitude: number } | null = null;
    let endCoords: { latitude: number; longitude: number } | null = null;

    // Determine start coordinates from either geolocation string or city name
    if (currentLocation.startsWith('Lat:')) {
      const parts = currentLocation.replace(/Lat:\s*|Lon:\s*/g, '').split(', ');
      if (parts.length === 2) {
        const lat = parseFloat(parts[0]);
        const lon = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
          startCoords = { latitude: lat, longitude: lon };
        }
      }
    } else {
      startCoords = getCoords(currentLocation) || null;
    }

    // Determine end coordinates from city name
    if (pickupLocation) {
      endCoords = getCoords(pickupLocation) || null;
    }

    if (startCoords && endCoords) {
      const distance = getDistanceFromLatLonInMiles(
        startCoords.latitude,
        startCoords.longitude,
        endCoords.latitude,
        endCoords.longitude
      );
      setEmptyMiles(String(Math.round(distance)));
    } else {
      setEmptyMiles('');
    }
  }, [currentLocation, pickupLocation]);
  
  useEffect(() => {
    const getCoords = (locationName: string) => usCities.find(c => c.name === locationName);

    const pickupCoords = getCoords(pickupLocation);
    const deliveryCoords = getCoords(deliveryLocation);

    if (pickupCoords && deliveryCoords) {
        const distance = getDistanceFromLatLonInMiles(
            pickupCoords.latitude,
            pickupCoords.longitude,
            deliveryCoords.latitude,
            deliveryCoords.longitude
        );
        setLoadedMiles(String(Math.round(distance)));
    } else {
        setLoadedMiles('');
    }
  }, [pickupLocation, deliveryLocation]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Current location is optional. Empty miles will be 0 if it's blank.
    if (!pickupLocation || !deliveryLocation || !pickupDate || !deliveryDate || emptyMiles === '' || loadedMiles === '') {
      alert('Please fill in all required fields and ensure locations are valid.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await onUpdateLoad({
          ...loadToEdit, // Contains id and original timestamp
          currentLocation,
          pickupLocation,
          deliveryLocation,
          pickupDate: new Date(pickupDate + 'T00:00:00'), // Ensure local date is parsed correctly
          deliveryDate: new Date(deliveryDate + 'T00:00:00'),
          reference,
          emptyMiles: Number(emptyMiles),
          loadedMiles: Number(loadedMiles),
          totalMiles,
        });
      } else {
        await onAddLoad({
          currentLocation,
          pickupLocation,
          deliveryLocation,
          pickupDate: new Date(pickupDate + 'T00:00:00'), // Ensure local date is parsed correctly
          deliveryDate: new Date(deliveryDate + 'T00:00:00'),
          reference,
          emptyMiles: Number(emptyMiles),
          loadedMiles: Number(loadedMiles),
          totalMiles,
        });
        resetForm(); // Reset form only on successful add
      }
    } catch (error) {
      console.error(`Failed to ${isEditMode ? 'update' : 'add'} load from form`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">{isEditMode ? 'Edit Load' : 'Add New Load'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="currentLocation" className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
          <div className="flex rounded-md shadow-sm">
            <AutocompleteInput
              id="currentLocation"
              value={currentLocation}
              onChange={setCurrentLocation}
              suggestions={cityNames}
              placeholder="Ex: Chicago, IL"
              wrapperClassName="flex-1"
              inputClassName="bg-white focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border border-gray-300 pl-3 pr-10 py-2"
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
          <label htmlFor="pickupLocation" className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
           <AutocompleteInput
            id="pickupLocation"
            value={pickupLocation}
            onChange={setPickupLocation}
            suggestions={cityNames}
            placeholder="Ex: Port of Long Beach, CA"
          />
        </div>

        <div>
          <label htmlFor="deliveryLocation" className="block text-sm font-medium text-gray-700 mb-1">Delivery Location</label>
          <AutocompleteInput
            id="deliveryLocation"
            value={deliveryLocation}
            onChange={setDeliveryLocation}
            suggestions={cityNames}
            placeholder="Ex: Warehouse in Phoenix, AZ"
          />
        </div>
        
        <div>
          <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">Reference (Optional)</label>
          <input
            type="text"
            id="reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., PO #12345, Booking #XYZ"
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
            <div>
              <label htmlFor="pickupDate" className="block text-sm font-medium text-gray-700">Pickup Date</label>
              <DatePickerInput
                 id="pickupDate"
                 value={pickupDate}
                 onChange={setPickupDate}
              />
              <DateShortcuts setDate={setPickupDate} />
            </div>
            <div>
              <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700">Delivery Date</label>
              <DatePickerInput
                 id="deliveryDate"
                 value={deliveryDate}
                 onChange={setDeliveryDate}
              />
              <DateShortcuts setDate={setDeliveryDate} />
            </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="emptyMiles" className="block text-sm font-medium text-gray-700">Empty Miles (Auto)</label>
              <input
                type="text"
                id="emptyMiles"
                value={emptyMiles}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
                placeholder="Select locations..."
                readOnly
              />
            </div>
            <div>
              <label htmlFor="loadedMiles" className="block text-sm font-medium text-gray-700">Loaded Miles (Auto)</label>
              <input
                type="text"
                id="loadedMiles"
                value={loadedMiles}
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-not-allowed"
                placeholder="Select locations..."
                readOnly
              />
            </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <div>
              <p className="text-sm font-medium text-blue-800">Total Miles</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totalMiles.toLocaleString()}</p>
            </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update Load' : 'Add Load')}
          </button>
          {isEditMode && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoadForm;