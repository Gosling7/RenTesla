import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { ReservationDto, ReservationStatus, UserInfoDto } from '../types/ApiResults';
import { useAuth } from '../contexts/AuthContext';
import { ReservationItem } from '../components/ReservationItem';

export const UserPage = () => {
    const [email, setEmail] = useState('');
    const [reservations, setReservations] = useState<ReservationDto[]>([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const [message, setMessage] = useState<string>('');
    
    const fetchReservations = useCallback(async () => {
        try {
            const res = await axios.get<ReservationDto[]>('/api/reservations/me');
            setReservations(res.data);
        } catch (err) {
            console.error('Failed to fetch reservations:', err);
            setMessage('Failed to load your reservations. Please try again later.');
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
            setMessage('Your return has been successfully confirmed!');
            
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
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 dark:text-white">Your Account</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Logged in as: <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                </p>
            </div>
            
            {message && (
                <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 p-4 rounded-xl mb-6">
                    {message}
                </div>
            )}
            
            <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold dark:text-white">Active Reservations</h2>
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-sm font-medium px-3 py-1 rounded-full">
                        {activeReservations.length}
                    </span>
                </div>
                
                {activeReservations.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 text-center border border-gray-200 dark:border-neutral-800">
                        <p className="text-gray-500 dark:text-gray-400">No active reservations</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeReservations.map(r => (
                            <ReservationItem 
                                key={r.id} 
                                reservation={r} 
                                onConfirmReturn={confirmReturn} 
                            />
                        ))}
                    </div>
                )}
            </section>
            
            <section>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold dark:text-white">Reservation History</h2>
                    <span className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
                        {pastReservations.length}
                    </span>
                </div>
                
                {pastReservations.length === 0 ? (
                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 text-center border border-gray-200 dark:border-neutral-800">
                        <p className="text-gray-500 dark:text-gray-400">No past reservations</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pastReservations.map(r => (
                            <ReservationItem 
                                key={r.id} 
                                reservation={r}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>


        // <div className="max-w-4xl mx-auto mt-10 text-white">
        //     <h1 className="text-3xl font-bold mb-6">Your Account</h1>
        //     <p className="mb-8 text-lg">Logged in as: <span className="font-semibold">{email}</span></p>
            
        //     {/* Message after confirming return */}
        //     {message && <div className="bg-green-600 text-white p-4 rounded-3xl mb-4">{message}</div>}
            
        //     <section className="mb-12">
        //         <h2 className="text-2xl font-semibold mb-4">Active Reservations</h2>
        //         {activeReservations.length === 0 ? (
        //             <p>No active reservations.</p>
        //         ) : (
        //             <ul className="space-y-4">
        //                 {activeReservations.map(r => (
        //                     <ReservationItem key={r.id} reservation={r} onConfirmReturn={confirmReturn} />
        //                 ))}
        //             </ul>
        //         )}
        //     </section>
            
        //     <section>
        //         <h2 className="text-2xl font-semibold mb-4">Reservation History</h2>
        //         {pastReservations.length === 0 ? (
        //             <p>No past reservations.</p>
        //         ) : (
        //             <ul className="space-y-4">
        //                 {pastReservations.map(r => (
        //                     <ReservationItem key={r.id} reservation={r} onConfirmReturn={null as any} />
        //                 ))}
        //             </ul>
        //         )}
        //     </section>
        // </div>
    );
};