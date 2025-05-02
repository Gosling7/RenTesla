import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface ApiResponse<TDataType> {
  isSuccess: boolean;
  data: TDataType[];
  errors: string[];
}

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
  const [code, setCode] = useState<string>('');
  const [details, setDetails] = useState<ReservationDetails[] | null>(null);
  const [error, setError] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const { isAuthenticated, email: loggedInUserEmail } = useAuth();
  
  const inputClass =
    'p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full';
  const labelClass = 'text-sm font-medium mb-1';

  useEffect(() => {
    if (isAuthenticated && loggedInUserEmail) {
      setEmail(loggedInUserEmail); // Automatically set the email if logged in
    }
  }, [isAuthenticated, loggedInUserEmail]);

  const handleSearch = async () => {
    try {
      setError('');
      setDetails(null);
      if (code === '') {
        setError('Please enter a reservation code');
        return;
      }

      if (!isAuthenticated && email === '') {
        setError('Please enter your email');
        return;
      }

      const response = await axios.get<ApiResponse<ReservationDetails>>(`/api/reservations`, {
        params: {
          reservationCode: code,
          email: isAuthenticated ? loggedInUserEmail : email
        }
      });

      if (response.data.isSuccess && response.data.data.length == 0)
      {
        setError('No active reservation found')
      } else {
        setDetails(response.data.data);
      }
    } catch (err: any) {
      setError(err.response.data?.errors?.join(', '));
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

        {!isAuthenticated && (
          <>
            <label className={labelClass}>Your Email</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            placeholder="Enter your email"
            />
          </>
        )}      
      </div>

      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
      >
        Search
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}

      {details && details.length > 0 && (
        <div className="mt-6 bg-gray-800 p-4 rounded shadow space-y-2">
          <h3 className="text-lg font-semibold">Reservation Details</h3>
          <p><strong>Code:</strong> {details[0].reservationCode}</p>
          <p><strong>Car Model:</strong> {details[0].carModelName}</p>
          <p><strong>Pick-up Location:</strong> {details[0].pickUpLocationName}</p>
          <p><strong>Drop-off Location:</strong> {details[0].dropOffLocationName}</p>
          <p><strong>From:</strong> {new Date(details[0].from).toLocaleString()}</p>
          <p><strong>To:</strong> {new Date(details[0].to).toLocaleString()}</p>
          <p><strong>Total Cost:</strong> €{details[0].totalCost}</p>
        </div>
      )}
    </div>
  );
};

export { ReservationsPage };
