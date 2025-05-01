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
  const [pickupLocationId, setPickupLocationId] = useState('');
  const [pickupLocationName, setPickupLocationName] = useState('');
  const [dropoffLocationId, setDropoffLocationId] = useState('');
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
      const response = await axios.get<AvailableModel[]>('api/car-models/available', {
        params: {
          pickupLocationId,
          dropoffLocationId,
          from,
          to
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
            setPickupLocationId(getLocationIdByName(name));
          }}
          suggestions={locations}
        />

        {/* Return Location */}        
        <InputWithSuggestions 
          label="Return"
          value={dropoffLocationName}
          onChange={(name) => {
            setDropoffLocationName(name);
            setDropoffLocationId(getLocationIdByName(name));
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
              pickupLocationId,
              dropoffLocationId,
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



// return (
//   // <div className="bg-gray/90 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-5xl mx-auto mt-6">
//   <div className="bg-gray-900 backdrop-blur-md rounded-xl p-6 shadow-lg w-full max-w-5xl mx-auto mt-6">
//     <form className="flex flex-col md:flex-row md:items-end gap-4">
//       {/* Departure */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Departure</label>
//         <input
//           type="text"
//           placeholder="City, airport or station"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>       

//       {/* Return Location */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Return Location</label>
//         <input
//           type="text"
//           placeholder="City, airport or station"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Pick Up Date & Time */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Pick Up Date & Time</label>
//         <input
//           type="datetime-local"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Return Date & Time */}
//       <div className="flex flex-col flex-1">
//         <label className="text-sm font-medium mb-1">Return Date & Time</label>
//         <input
//           type="datetime-local"
//           className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         />
//       </div>

//       {/* Search Button */}
//       <div className="flex">
//         <button
//           type="submit"
//           className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
//         >
//           Search
//         </button>
//       </div>
//     </form>
//   </div>
// );



 {/* Round Trip Toggle */}
        {/* <div className="flex flex-col items-start">
          <label className="text-sm font-medium mb-1">Round-trip?</label>
          <button
            type="button"
            onClick={() => setRoundTrip(!roundTrip)}
            className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out ${
              roundTrip ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out ${
                roundTrip ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div> */}

        
        {/* Filter (With/Without Driver) */}
        {/* <div className="flex flex-col items-start">
          <label className="text-sm font-medium mb-1">Filter</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilter('without')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'without'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Without Driver
            </button>
            <button
              type="button"
              onClick={() => setFilter('with')}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === 'with'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              With Driver
            </button>
          </div>
        </div> */}


