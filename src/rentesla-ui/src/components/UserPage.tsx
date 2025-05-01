import { useEffect, useState } from 'react';
import axios from 'axios';

interface ReservationDTO {
  id: string;
  carModelName: string;
  pickUpLocationName: string;
  dropOffLocationName: string;
  from: string;
  to: string;
  totalCost: number;
  reservationCode: string;
}

const UserPage = () => {
  const [email, setEmail] = useState('');
  const [reservations, setReservations] = useState<ReservationDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userRes = await axios.get('/api/auth/me');
        setEmail(userRes.data);
        const reservationRes = await axios.get(`/api/reservations/${userRes.data}`);        
        setReservations(reservationRes.data);
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const now = new Date();
  const activeReservations = reservations.filter(r => new Date(r.to) > now);
  const pastReservations = reservations.filter(r => new Date(r.to) <= now);

  if (loading) return <div className="text-white p-6">Loading dashboard...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Account</h1>
      <p className="mb-8 text-lg">Logged in as: <span className="font-semibold">{email}</span></p>

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