import { useEffect, useState } from 'react';
import axios from 'axios';
import { ApiResult, ReservationDto, ReservationStatus, UserInfoDto } from '../types/ApiResults';
import { useAuth } from '../contexts/AuthContext';

const UserPage = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState<ReservationDto[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axios.get<ApiResult<UserInfoDto>>('/api/auth/me');
        setEmail(response.data.data.email);
        const result = await axios.get<ApiResult<ReservationDto[]>>('/api/reservations/me');
        setReservations(result.data.data);
      } catch (err: any) {
        if (err.response.status === 405) {
          console.log("method not allowed");
        }
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const confirmReturn = async (reservationId: string) => {
    try {
      await axios.post(`/api/reservations/${reservationId}/confirm-return`);
      setMessage('Your return has been successfully confirmed!');
      
      // Refresh the reservation list after confirming return
      const result = await axios.get<ApiResult<ReservationDto[]>>('/api/reservations/me');
      setReservations(result.data.data);
    } catch (error) {
      console.error('Error confirming return:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const activeReservations: ReservationDto[] = reservations.filter(r => r.status !== ReservationStatus.Completed);
  const pastReservations: ReservationDto[] = reservations.filter(r => r.status === ReservationStatus.Completed);

  if (loading) return <div className="text-white p-6">Loading dashboard...</div>;

  if (!isAuthenticated) {
    return (
      <div className="text-white p-6">
        <p>Please <a href="/login" className="text-blue-400 underline">log in</a> to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Account</h1>
      <p className="mb-8 text-lg">Logged in as: <span className="font-semibold">{email}</span></p>

      {/* Message after confirming return */}
      {message && <div className="bg-green-600 text-white p-4 rounded mb-4">{message}</div>}

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Active Reservations</h2>
        {activeReservations.length === 0 ? (
          <p>No active reservations.</p>
        ) : (
          <ul className="space-y-4">
            {activeReservations.map(r => (
              <li key={r.id} className="bg-gray-800 p-4 rounded shadow">
                <p><strong>Car:</strong> {r.carModelName}</p>
                <p><strong>From:</strong> {new Date(r.from).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(r.to).toLocaleString()}</p>
                <p><strong>Pickup:</strong> {r.pickUpLocationName}</p>
                <p><strong>Dropoff:</strong> {r.dropOffLocationName}</p>
                <p><strong>Total Cost:</strong> €{r.totalCost}</p>
                <p><strong>Reservation Code:</strong> {r.reservationCode}</p>

                {/* Disable the button after confirmation */}
                <button
                  onClick={() => confirmReturn(r.id)}
                  className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                  disabled={r.status !== ReservationStatus.Active}  // Disable if already completed
                >
                  {r.status !== ReservationStatus.Active ? "You've confirmed return" : 'Confirm Return'}
                </button>
                {r.status !== ReservationStatus.Active &&
                  <p>Awaiting our return confirmation</p>
                }
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Reservation History</h2>
        {pastReservations.length === 0 ? (
          <p>No past reservations.</p>
        ) : (
          <ul className="space-y-4">
            {pastReservations.map(r => (
              <li key={r.id} className="bg-gray-800 p-4 rounded shadow">
                <p><strong>Car:</strong> {r.carModelName}</p>
                <p><strong>From:</strong> {new Date(r.from).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(r.to).toLocaleString()}</p>
                <p><strong>Pickup:</strong> {r.pickUpLocationName}</p>
                <p><strong>Dropoff:</strong> {r.dropOffLocationName}</p>
                <p><strong>Total Cost:</strong> €{r.totalCost}</p>
                <p><strong>Reservation Code:</strong> {r.reservationCode}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export { UserPage };
