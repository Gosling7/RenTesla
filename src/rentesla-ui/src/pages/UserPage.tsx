import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ReservationDto, ReservationStatus, UserInfoDto } from '../types/ApiResults';
import { useAuth } from '../contexts/AuthContext';
import { ReservationItem } from '../components/ReservationItem';
import { ItemsCount } from '../components/ItemsCount';

export const UserPage = () => {
    const [email, setEmail] = useState('');
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const [carReturnMessage, setCarReturnMessage] = useState<string>('');
    
    const fetchReservations = useCallback(async () => {
        try {
            const res = await axios.get<ReservationDto[]>('/api/reservations/me');
            setReservations(res.data);
        } catch (err) {
            console.error('Failed to fetch reservations:', err);
            setCarReturnMessage('Failed to load your reservations. Please try again later.');
        }
    }, []);
    
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const response = await axios.get<UserInfoDto>('/api/auth/me');
                setEmail(response.data.email);
                await fetchReservations();
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
    }, [fetchReservations]);  
    
    const confirmReturn = async (reservationId: string) => {
        try {
            await axios.post(`/api/reservations/${reservationId}/confirm-return`);
            setCarReturnMessage('Your return has been successfully confirmed!');
            
            // Refresh the reservation list after confirming return
            await fetchReservations();
        } catch (error) {
            console.error('Error confirming return:', error);
            alert('Something went wrong. Please try again.');
        }
    };
    const now = new Date();
    const activeReservations = reservations.filter(
        r => new Date(r.to) > now 
        && r.status !== ReservationStatus.Completed);
    const pastReservations = reservations.filter(r =>
        (r.status === ReservationStatus.Completed || r.status === ReservationStatus.Cancelled)
        || new Date(r.to) <= now);
            
    if (loading) return <div className="text-white p-6">Loading dashboard...</div>;
    
    if (!isAuthenticated) {
        return (
            <div className="text-white p-6">
                <p>Please <a href="/login" className="text-blue-400 underline">log in</a> to access your dashboard.</p>
            </div>
        );
    }
    
    return (
        <div className="max-w-5xl mx-auto p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2 dark:text-white">Your Account</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Logged in as: <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                </p>
            </header>
            
            {carReturnMessage && (
                <aside className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-xl mb-6">
                    {carReturnMessage}
                </aside>
            )}

            <section className="mb-12">
                <ReservationsHeader text="Active Reservations">
                    <ItemsCount value={activeReservations.length} />
                </ReservationsHeader>
                
                {activeReservations.length === 0 ? (
                    <NoReservations text="No active reservations" />
                ) : (
                    <ul className="space-y-4">
                        {activeReservations.map(r => (
                            <li key={r.id}>
                                <ReservationItem 
                                    reservation={r} 
                                    onConfirmReturn={confirmReturn} 
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
            
            <section>
                <ReservationsHeader text="Reservation History">
                    <ItemsCount value={pastReservations.length} />
                </ReservationsHeader>
                
                {pastReservations.length === 0 ? (
                    <NoReservations text="No past reservations" />
                ) : (
                    <ul className="space-y-4">
                        {pastReservations.map(r => (
                            <li key={r.id}>
                                <ReservationItem reservation={r} />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );    
};

const ReservationsHeader = ({ text, children }: { text: string, children: React.ReactNode }) => (
    <header className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold dark:text-white">{text}</h2>
        {children}
    </header>
);

const NoReservations = ({ text }: {text: string }) => (
    <article className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 text-center border border-gray-200 dark:border-neutral-800">
        <p className="text-gray-500 dark:text-gray-400">{text}</p>
    </article>
);