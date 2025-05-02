import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { InputWithSuggestions, LocationDTO } from './InputWithSuggestions';
import { useNavigate } from 'react-router';

interface AvailableModel {
  id: string;
  name: string;
  dailyRate: number;
  availableCount: number;
};

const ReservationForm = () => {
  const [pickUpLocationId, setPickUpLocationId] = useState('');
  const [pickupLocationName, setPickupLocationName] = useState('');
  const [dropOffLocationId, setDropOffLocationId] = useState('');
  const [dropoffLocationName, setDropoffLocationName] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [availableModels, setAvailableModels] = useState<AvailableModel[]>([]);
  const [locations, setLocations] = useState<LocationDTO[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get<LocationDTO[]>(`/api/locations`);     
        setLocations(response.data)
      } catch (error) {
        console.error('Error fetching locations: ', error);
      }
    };

    fetchLocations();
  }, []);

  const getLocationIdByName = (name: string): string => {
    const match = locations.find((loc) => loc.name === name);
    return match ? match.id : '';
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await axios.get<AvailableModel[]>('api/car-models', {
        params: {
          available: true,
          pickupLocationId: pickUpLocationId,
          from: from,
          to: to
        }
      });
      setAvailableModels(response.data);
    } catch (error) {
      console.error('Error fetching available models: ', error);
    }
  };

  const inputClass = 'p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400';
  const labelClass = 'text-sm font-medium mb-1';

  const navigate = useNavigate();

  return (
    <div className="bg-gray-900 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-9/10 mx-auto mt-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Departure */}        
        <InputWithSuggestions 
          label="Departure"
          value={pickupLocationName}
          onChange={(name) => {
            setPickupLocationName(name);
            setPickUpLocationId(getLocationIdByName(name));
          }}
          suggestions={locations}
        />

        {/* Return Location */}        
        <InputWithSuggestions 
          label="Return"
          value={dropoffLocationName}
          onChange={(name) => {
            setDropoffLocationName(name);
            setDropOffLocationId(getLocationIdByName(name));
          }}
          suggestions={locations}
        />

        {/* Pick Up Date & Time */}
        <div className="flex flex-col">
          <label className={labelClass}>Pick Up Date & Time</label>
          <input
            type="datetime-local"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Return Date & Time */}
        <div className="flex flex-col">
          <label className={labelClass}>Return Date & Time</label>
          <input
            type="datetime-local"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Search Button */}
        <div className="flex col-span-1 sm:col-span-2 md:col-span-4 justify-center">
          <button
            type="submit"
            className={inputClass}
          >
            Search
          </button>
        </div>
      </form>

      {/* Results */}
      <div className="mt-6 text-white">
        {availableModels.length > 0 ? (
          <ul className="space-y-4">
            {availableModels.map((model) => (
              <li key={model.id} className="bg-gray-800 p-4 rounded shadow">
                <div className="font-semibold">{model.name}</div>
                <div>Daily Rate: €{model.dailyRate}</div>
                <div>Available: {model.availableCount}</div>
                <button
        className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
        onClick={() => {
          navigate('/reservations/create', {
            state: {
              selectedModel: model,
              pickupLocationId: pickUpLocationId,
              dropoffLocationId: dropOffLocationId,
              from,
              to,
              locations
            }
          });
        }}
      >
        Choose
      </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-400">No models available (or not searched yet).</p>
        )}
      </div>

    </div>
  );
};

export { ReservationForm };
export type { AvailableModel };