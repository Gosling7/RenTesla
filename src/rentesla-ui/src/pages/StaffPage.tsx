import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReservationDto, ReservationStatus } from '../types/ApiResults';
import { useAuth } from '../contexts/AuthContext';

const StaffPage = () => {
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userRoles } = useAuth();

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const response = await axios.get<ReservationDto[]>('/api/reservations/pending-return');
        setReservations(response.data);
      } catch (err) {
        console.error('Failed to fetch reservations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadReservations();
  }, []);

  const confirmReturn = async (reservationId: string) => {
    try {
      await axios.post(`/api/reservations/${reservationId}/confirm-return`);
      setReservations(prev =>
        prev.map(r =>
          r.id === reservationId ? { ...r, status: ReservationStatus.Completed } : r
        )
      );
    } catch (err) {
      console.error('Failed to confirm return:', err);
    }
  };

  if (!isAuthenticated && !userRoles.includes('Staff')) {
    return (
        <div className="text-white p-6">
          <p>You're not a staff member. Click <a href="/" className="text-blue-400 underline">here</a> to return to homepage.</p>
        </div>
      );
    }

  if (loading) return <p className="text-white p-6">Loading reservations...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Active Reservations - Staff Panel</h1>
      <ul className="space-y-4">
        {reservations.map(reservation => (
          <li key={reservation.id} className="bg-gray-800 p-4 rounded shadow">
            {/* <p><strong>User Email:</strong> {reservation.userEmail}</p> */}
            <p><strong>Car:</strong> {reservation.carModelName}</p>
            <p><strong>From:</strong> {new Date(reservation.from).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(reservation.to).toLocaleString()}</p>
            <p><strong>Status:</strong> {ReservationStatus[reservation.status]}</p>
            <button
              className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
              disabled={reservation.status === ReservationStatus.Completed}
              onClick={() => confirmReturn(reservation.id)}
            >
              {reservation.status === ReservationStatus.Completed ? 'Confirmed' : 'Confirm Return'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StaffPage;