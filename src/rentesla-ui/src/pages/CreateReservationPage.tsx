import { useLocation, useNavigate } from 'react-router';
import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CarModelDto, LocationDto } from '../types/ApiResults';
import { AuthRequest, CreateReservationRequest } from '../types/ApiRequests';
import { LabeledInput } from '../components/LabeledInput';
import axios from 'axios';
import { Button } from '../components/Button';
import { getImageForCarModel } from '../utils/carImageMap';
import { ProblemDetails } from "../types/ProblemDetails";

type ReservationFormState = {
    selectedModel: CarModelDto;
    pickupLocationId: string;
    dropoffLocationId: string;
    from: string;
    to: string;
    locations: LocationDto[];
};

type AuthFormState = {
    email: string;
    password: string;
    createAccount: boolean;
};

export const CreateReservationPage = () => {
    const navigate = useNavigate();
    const { state } = useLocation();
    const {
        selectedModel,
        pickupLocationId,
        dropoffLocationId,
        from,
        to,
        locations
    } = (state as ReservationFormState) || {};

    const { login, isAuthenticated, user } = useAuth();
    
    const [authForm, setAuthForm] = useState<AuthFormState>({
        email: '',
        password: '',
        createAccount: false
    });
    const [reservationCode, setReservationCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    if (!selectedModel) {
        return <NoModelSelectedView onNavigateBack={() => navigate('/')} />;
    }

    // Helper functions
    const getLocationName = useCallback(
        (id: string) => locations.find(loc => loc.id === id)?.name || 'Unknown',
        [locations]
    );

    const handleAuthFormChange = (field: keyof AuthFormState, value: string | boolean) => {
        setAuthForm(prev => ({ ...prev, [field]: value }));
    };

    const extractErrors = (problemDetails: ProblemDetails): string => {
        if (!problemDetails.errors) {
            return problemDetails.title || "An unknown error occurred";
        }
        
        return Object.entries(problemDetails.errors)
            .flatMap(([field, messages]) => messages.map(msg => `${field}: ${msg}`))
            .join(', ');
    };

    const handleAuthErrors = (error: any) => {
        const data = error.response?.data;
        setEmailError('');
        setPasswordError('');

        if (data?.errors) {
            if (data.errors.Email) {
                setEmailError(data.errors.Email.join(', '));
            }
            if (data.errors.Password) {
                setPasswordError(data.errors.Password.join(', '));
            }
        } else if (typeof data === 'string') {
            setEmailError(data);
        } else if (data?.title) {
            setEmailError(data.title);
        } else {
            setEmailError('An unexpected error occurred.');
        }
    };

    const handleConfirmReservation = async () => {
        try {
            const request: CreateReservationRequest = {
                email: isAuthenticated ? user?.email! : authForm.email,
                carModelId: selectedModel.id,
                pickUpLocationId: pickupLocationId,
                dropOffLocationId: dropoffLocationId,
                from,
                to,
                totalCost: selectedModel.totalCost,
                createAccount: authForm.createAccount,
                password: authForm.password
            };
            
            const response = await axios.post<string>('/api/reservations', request);
            setReservationCode(response.data);
            
            if (authForm.createAccount && authForm.password) {
                await handleCreateAccount();
            }
        } catch (error: any) {
            const errorMessage = extractErrors(error.response.data);
            setError(errorMessage);
        }
    };

    const handleCreateAccount = async () => {
        try {
            const request: AuthRequest = { 
                email: authForm.email, 
                password: authForm.password 
            };
            await login(request);
        } catch (error) {
            handleAuthErrors(error);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-6 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">
                Confirm Your Reservation
            </h1>

            <VehicleDetailsSection model={selectedModel} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <LocationDetailsSection 
                    pickupLocation={getLocationName(pickupLocationId)}
                    dropoffLocation={getLocationName(dropoffLocationId)}
                />
                <DateTimeSection from={from} to={to} />
            </div>

            <TotalCostSection total={selectedModel.totalCost} />

            {!isAuthenticated && (
                <GuestCheckoutSection
                    formState={authForm}
                    onFormChange={handleAuthFormChange}
                    emailError={emailError}
                    passwordError={passwordError}
                />
            )}

            {reservationCode ? (
                <ReservationSuccessView 
                    reservationCode={reservationCode}
                    onNavigateBack={() => navigate('/')}
                />
            ) : (
                <>
                    <Button onClick={handleConfirmReservation}>
                        Confirm Reservation
                    </Button>

                    {error && (
                        <p className="mt-4 text-red-500 dark:text-red-400"> {error} </p>)}
                </>
            )}
        </div>
    );
};

const NoModelSelectedView = ({ onNavigateBack }: { onNavigateBack: () => void }) => (
    <div className="p-6 text-white text-center">
        <p className="text-lg mb-4">No model selected.</p>
        <button
            onClick={onNavigateBack}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
            Go Back
        </button>
    </div>
);

const VehicleDetailsSection = ({ model }: { model: CarModelDto }) => (
    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Vehicle Details</h2>
        <div className="flex flex-col sm:flex-row gap-6">
            <img
                src={getImageForCarModel(model.name)}
                alt={model.name}
                className="w-full sm:w-40 h-40 object-cover rounded-lg"
            />
            <div className="flex-1">
                <h3 className="text-xl font-semibold dark:text-white">{model.name}</h3>
                <div className="mt-3 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Daily Rate</p>
                        <p className="text-lg font-medium dark:text-white">€{model.baseDailyRate}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
                        <p className="text-lg font-medium dark:text-white">€{(model.baseDailyRate / 10).toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const LocationDetailsSection = ({ 
    pickupLocation, 
    dropoffLocation 
}: { 
    pickupLocation: string; 
    dropoffLocation: string 
}) => (
    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Locations</h2>
        <div className="space-y-3">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</p>
                <p className="dark:text-white">{pickupLocation}</p>
            </div>
            
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Dropoff Location</p>
                <p className="dark:text-white">{dropoffLocation}</p>
            </div>
        </div>
    </div>
);

const DateTimeSection = ({ from, to }: { from: string; to: string }) => (
    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Date & Time</h2>
        <div className="space-y-3">
            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pickup</p>
                <p className="dark:text-white">{new Date(from).toLocaleString()}</p>
            </div>

            <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Return</p>
                <p className="dark:text-white">{new Date(to).toLocaleString()}</p>
            </div>
        </div>
    </div>
);

const TotalCostSection = ({ total }: { total: number }) => (
    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-8 border border-gray-200 dark:border-neutral-800">
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold dark:text-white">Estimated Total</h2>
            <p className="text-2xl font-bold dark:text-white">€{total}</p>
        </div>
    </div>
);

const GuestCheckoutSection = ({
    formState,
    onFormChange,
    emailError,
    passwordError
}: {
    formState: AuthFormState;
    onFormChange: (field: keyof AuthFormState, value: string | boolean) => void;
    emailError: string;
    passwordError: string;
}) => (
    <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-8 border border-gray-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Contact Information</h2>
        
        <div className="space-y-4">
            <LabeledInput
                label="Email Address"
                type="email"
                value={formState.email}
                onChange={(e) => onFormChange('email', e.target.value)}
                placeholder="your@email.com"
                required
                error={emailError}
            />

            <div className="flex items-center">
                <input
                    id="create-account"
                    type="checkbox"
                    checked={formState.createAccount}
                    onChange={() => onFormChange('createAccount', !formState.createAccount)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="create-account" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Create an account with this email
                </label>
            </div>

            {formState.createAccount && (
                <LabeledInput
                    label="Password"
                    type="password"
                    value={formState.password}
                    onChange={(e) => onFormChange('password', e.target.value)}
                    placeholder="Create a password"
                    required
                    error={passwordError}
                />
            )}
        </div>
    </div>
);

const ReservationSuccessView = ({
    reservationCode,
    onNavigateBack
}: {
    reservationCode: string;
    onNavigateBack: () => void;
}) => (
    <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
        <h2 className="text-xl font-semibold mb-2 dark:text-white">Reservation Confirmed!</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
            Your reservation code is: <span className="font-bold">{reservationCode}</span>
        </p>

        <Button onClick={onNavigateBack}>
            Back to Home
        </Button>
    </div>
);
