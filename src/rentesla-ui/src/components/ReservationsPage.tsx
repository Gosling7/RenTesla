import { useState } from 'react';
import axios from 'axios';

interface ReservationDetails {
  reservationCode: string;
  from: string;
  to: string;
  totalCost: number;
  carModelName: string;
  pickUpLocationName: string;
  dropOffLocationName: string;
}

const ReservationsPage = () => {
  const [code, setCode] = useState('');
  const [details, setDetails] = useState<ReservationDetails | null>(null);
  const [error, setError] = useState('');

  const inputClass =
    'p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full';
  const labelClass = 'text-sm font-medium mb-1';

  const handleSearch = async () => {
    try {
      setError('');
      setDetails(null);

      const response = await axios.get(`/api/reservations/${code}`);
      setDetails(response.data);
    } catch (err) {
      setError('Reservation not found. Please check your code.');
    }
  };

  return (
    <div className="bg-gray-900 text-white rounded-xl p-6 shadow-lg max-w-2xl mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Find Your Reservation</h2>

      <div className="mb-4">
        <label className={labelClass}>Reservation Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className={inputClass}
          placeholder="Enter your reservation code"
        />
      </div>

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
      >
        Search
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {details && (
        <div className="mt-6 bg-gray-800 p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Reservation Details</h3>
          <p><strong>Code:</strong> {details.reservationCode}</p>
          <p><strong>Car Model:</strong> {details.carModelName}</p>
          <p><strong>Pick-up Location:</strong> {details.pickUpLocationName}</p>
          <p><strong>Drop-off Location:</strong> {details.dropOffLocationName}</p>
          <p><strong>From:</strong> {new Date(details.from).toLocaleString()}</p>
          <p><strong>To:</strong> {new Date(details.to).toLocaleString()}</p>
          <p><strong>Total Cost:</strong> €{details.totalCost}</p>
        </div>
      )}
    </div>
  );
};

export { ReservationsPage };
