import axios from 'axios';
import { LocationDTO } from './InputWithSuggestions';
import { AvailableModel } from './ReservationForm';
import { useLocation, useNavigate } from 'react-router';

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
      const response = await axios.post('/api/reservations', {
        CarModelId: selectedModel.id,
        PickUpLocationId: pickupLocationId,
        DropOffLocationId: dropoffLocationId,
        From: from,
        To: to
      });

      const reservationId = response.data.id;
      navigate(`/reservation/confirmed/${reservationId}`);
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
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={handleConfirmReservation}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
        >
          Confirm Reservation
        </button>
      </div>
    </div>
  );
};

export { CreateReservationPage };