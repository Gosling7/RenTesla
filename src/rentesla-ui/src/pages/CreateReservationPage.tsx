import axios from 'axios';
import { LocationDTO } from '../components/InputWithSuggestions';
import { AvailableModel } from '../components/ReservationForm';
import { useLocation, useNavigate } from 'react-router';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CreateReservationPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { 
    selectedModel, 
    pickupLocationId, 
    dropoffLocationId, 
    from, 
    to, 
    locations = []
}: {
    selectedModel: AvailableModel;
    pickupLocationId: string;
    dropoffLocationId: string;
    from: string;
    to: string;
    locations: LocationDTO[]
} = state || {};
  const [reservationCode, setReservationCode] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const { setAuthenticated, isAuthenticated, email: loggedInUserEmail } = useAuth();

  if (!selectedModel) {
    return (
      <div className="p-6 text-white text-center">
        <p className="text-lg mb-4">No model selected.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Go Back
        </button>
      </div>
    );
  }

  const getLocationName = (id: string): string =>
    locations.find(loc => loc.id === id)?.name || 'Unknown';

  const handleConfirmReservation = async () => {
    try {
      // 1. Make reservation
      const response = await axios.post('/api/reservations', {
        CarModelId: selectedModel.id,
        PickUpLocationId: pickupLocationId,
        DropOffLocationId: dropoffLocationId,
        From: from,
        To: to,
        Email: isAuthenticated ? loggedInUserEmail : email
      });

      const reservationCode = response.data;
      setReservationCode(reservationCode);

      // 2. If user wants to create an account
      if (createAccount && password) {
        await axios.post('/api/auth/register', {
          email,
          password,
        });

        await axios.post('/api/auth/login', {
          email,
          password,
        });
        setAuthenticated(true);
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-gray-800 rounded-xl shadow-lg p-6 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Reservation Summary</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Car Model</h2>
          <p>{selectedModel.name}</p>
          <p className="text-sm text-gray-300">Daily Rate: €{selectedModel.dailyRate}</p>
          <p className="text-sm text-gray-300">Available: {selectedModel.availableCount}</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-2">Locations</h2>
          <p>Pickup: {getLocationName(pickupLocationId)}</p>
          <p>Dropoff: {getLocationName(dropoffLocationId)}</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Date & Time</h2>
          <p>From: {new Date(from).toLocaleString()}</p>
          <p>To: {new Date(to).toLocaleString()}</p>
        </div>

        {/* Email Input Field */}
        {/* <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Your Email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-600 text-white"
            placeholder="Enter your email"
          />
        </div> */}
      </div>
      {!isAuthenticated && (
        <>
          {/* Account Creation Checkbox */}
          <div className="col-span-1 mt-10 sm:col-span-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={createAccount}
              onChange={() => setCreateAccount(prev => !prev)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span>Create an account with this email</span>
          </label>
          </div>

          {/* Email Input */}
          <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
          <h2 className="text-xl font-semibold mb-2">Your Email</h2>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 rounded-lg bg-gray-600 text-white"
            placeholder="Enter your email"
            required
          />
          </div>

          {/* Password Input (conditionally shown) */}
          {createAccount && (
          <div className="bg-gray-700 rounded-lg mt-2 p-4 col-span-1 sm:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Password</h2>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-2 rounded-lg bg-gray-600 text-white"
              placeholder="Enter a password"
              required={createAccount}
            />
          </div>
          )}
        </>
      )}
      

      {reservationCode ? (
        <div className="mt-6 text-center">
          <p className="text-lg font-semibold">Your reservation has been confirmed!</p>
          <p className="text-sm text-gray-300">Reservation Code: {reservationCode}</p>
        </div>
      ) : (
        <div className="mt-6 text-center">
          <button
            onClick={handleConfirmReservation}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
          >
            Confirm Reservation
          </button>
        </div>
      )}
    </div>
  );
};

export { CreateReservationPage };


// {/* Account Creation Checkbox */}
// <div className="col-span-1 mt-10 sm:col-span-2">
// <label className="flex items-center space-x-2">
//   <input
//     type="checkbox"
//     checked={createAccount}
//     onChange={() => setCreateAccount(prev => !prev)}
//     className="form-checkbox h-4 w-4 text-blue-600"
//   />
//   <span>Create an account with this email</span>
// </label>
// </div>

// {/* Email Input */}
// <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
// <h2 className="text-xl font-semibold mb-2">Your Email</h2>
// <input
//   type="email"
//   value={email}
//   onChange={e => setEmail(e.target.value)}
//   className="w-full p-2 rounded-lg bg-gray-600 text-white"
//   placeholder="Enter your email"
//   required
// />
// </div>

// {/* Password Input (conditionally shown) */}
// {createAccount && (
// <div className="bg-gray-700 rounded-lg mt-2 p-4 col-span-1 sm:col-span-2">
//   <h2 className="text-xl font-semibold mb-2">Password</h2>
//   <input
//     type="password"
//     value={password}
//     onChange={e => setPassword(e.target.value)}
//     className="w-full p-2 rounded-lg bg-gray-600 text-white"
//     placeholder="Enter a password"
//     required={createAccount}
//   />
// </div>
// )}