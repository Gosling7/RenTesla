import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ReservationDto } from '../types/ApiResults';
import { ReservationDetailsCard } from '../components/ReservationDetailsCard';

const inputClass ='p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full';
const labelClass = 'text-sm font-medium mb-1';

export const ReservationsPage = () => {
    const [code, setCode] = useState<string>('');
    const [details, setDetails] = useState<ReservationDto | null>(null);
    const [email, setEmail] = useState<string>('');
    const { isAuthenticated, user } = useAuth();
    const [codeError, setCodeError] = useState('');
    const [emailError, setEmailError] = useState('');
    
    // Automatically set the email if logged in
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            setEmail(user.email); 
        }
    }, [isAuthenticated, user?.email]);
    
    const handleSearch = async () => {
        try {
            setCodeError('');
            setEmailError('');
            setDetails(null);
            if (code === '') {
                setCodeError('Please enter a reservation code');
                return;
            }
            
            if (!isAuthenticated && email === '') {
                setEmailError('Please enter your email');
                return;
            }
            
            const response = await axios.get<ReservationDto>(`/api/reservations`, {
                params: {
                    reservationCode: code,
                    email: email
                }
            });
            
            if (!response.data)
                {
                setCodeError('No active reservation found');
            } else {
                setDetails(response.data);
            }
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors && typeof errors === 'object') {
                setCodeError(errors.ReservationCode?.[0] || '');
                setEmailError(errors.Email?.[0] || '');
            }
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
                {codeError && <p className="text-red-400 text-sm mt-1">{codeError}</p>}
                
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
                        {emailError && <p className="text-red-400 text-sm mt-1">{emailError}</p>}
                    </>
                )}      
            </div>
            
            <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md text-white"
                disabled={!code || (!isAuthenticated && !email)}
            >
                Search
            </button>
            
            {details && <ReservationDetailsCard details={details} />}
        </div>
    );
};