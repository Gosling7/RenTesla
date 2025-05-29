import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { ReservationDto } from '../types/ApiResults';
import { LabeledInput } from './LabeledInput';
import { Button } from './Button';

interface Props {
    onResult: (reservation: ReservationDto) => void;
}

export const ReservationSearchForm = ({ onResult }: Props) => {
    const [code, setCode] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [codeError, setCodeError] = useState('');
    const [emailError, setEmailError] = useState('');
    const { isAuthenticated, user } = useAuth();
    
    useEffect(() => {
        if (isAuthenticated && user?.email) {
            setEmail(user.email);
        }
    }, [isAuthenticated, user?.email]);
    
    const handleSearch = async () => {
        setCodeError('');
        setEmailError('');
        setLoading(true);
        
        try {
            if (!code.trim()) {
                setCodeError('Please enter a reservation code');
                return;
            }
            
            if (!isAuthenticated && !email.trim()) {
                setEmailError('Please enter your email');
                return;
            }
            
            const response = await axios.get<ReservationDto>('/api/reservations', {
                params: {
                    reservationCode: code.trim(),
                    email: email.trim(),
                },
            });
            
            if (!response.data) {
                setCodeError('No active reservation found');
            } else {
                onResult(response.data);
            }
        } catch (err: any) {
            const errors = err.response?.data?.errors;
            if (errors && typeof errors === 'object') {
                setCodeError(errors.ReservationCode?.[0] || '');
                setEmailError(errors.Email?.[0] || '');
            } else {
                setCodeError('Something went wrong. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleSearch();
    };
    
    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <LabeledInput
                label="Reservation Code"
                type="text"
                value={code}
                onChange={(e) => {
                    setCode(e.target.value.toUpperCase());
                    if (codeError) setCodeError('');
                }}
                placeholder="Enter your reservation code"
                error={codeError}
                required
            />
        
            {!isAuthenticated && (
                <LabeledInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError('');
                    }}
                    placeholder="Enter your email"
                    error={emailError}
                    required
                />
            )}
        
            <Button 
                type="submit" 
                disabled={loading || !code || (!isAuthenticated && !email)}
            >
                {loading ? 'Searching...' : 'Search Reservation'}
            </Button>
        </form>
    );
};