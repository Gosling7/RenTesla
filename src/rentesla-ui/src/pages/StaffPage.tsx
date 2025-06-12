import { useEffect, useState } from 'react';
import axios from 'axios';
import { ReservationDto, ReservationStatus } from '../types/ApiResults';
import { useAuth } from '../contexts/AuthContext';
import { StaffReservationItem } from '../components/StaffReservationItem';

export const StaffPage = () => {
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated, user } = useAuth();
    
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
    
    if (!isAuthenticated || !user?.roles.includes('Staff')) {
        return (
            <div className="dark:text-white p-6">
                <p>You're not a staff member. Click <a href="/" className="text-blue-400 underline">here</a> to return to homepage.</p>
            </div>
        );
    }
    
    if (loading) return <p className="text-white p-6">Loading reservations...</p>;
    
    return (
        <div className="max-w-4xl mx-auto mt-10 px-6">
            <h1 className="text-3xl font-bold mb-6 dark:text-white">
                Active Reservations - Staff Panel
            </h1>
            
            <ul className="space-y-6">
                {reservations.map(r => (
                    <StaffReservationItem key={r.id} reservation={r} onConfirmReturn={confirmReturn} />
                ))}
            </ul>
        </div>
    );
};