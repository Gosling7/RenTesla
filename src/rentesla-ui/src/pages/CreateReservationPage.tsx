import { useLocation, useNavigate } from 'react-router';
import { useCallback, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CarModelDto, LocationDto } from '../types/ApiResults';
import { AuthRequest, CreateReservationRequest } from '../types/ApiRequests';
import { LabeledInput } from '../components/LabeledInput';
import { ProblemDetails } from '../types/ProblemDetails';
import axios from 'axios';
import { Button } from '../components/Button';
import { getImageForCarModel } from '../utils/carImageMap';

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
    }: {
        selectedModel: CarModelDto;
        pickupLocationId: string;
        dropoffLocationId: string;
        from: string;
        to: string;
        locations: LocationDto[];
    } = state || {};

    const [reservationCode, setReservationCode] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [createAccount, setCreateAccount] = useState<boolean>(false);
    const [password, setPassword] = useState<string>('');
    const { login, isAuthenticated, user } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

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

    const getLocationName = useCallback(
        (id: string) => locations.find(loc => loc.id === id)?.name || 'Unknown',
        [locations]
    ); 

    const extractErrors = (problemDetails: ProblemDetails): string => {
        if (!problemDetails.errors) return problemDetails.title || "An unknown error occurred";
        return Object.entries(problemDetails.errors)
            .flatMap(([field, messages]) =>
                messages.map(msg => `${field}: ${msg}`)
            )
            .join(', ');
    }

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
                email: isAuthenticated ? user?.email! : email,
                carModelId: selectedModel.id,
                pickUpLocationId: pickupLocationId,
                dropOffLocationId: dropoffLocationId,
                from: from,
                to: to,
                totalCost: selectedModel.totalCost,
                createAccount: createAccount,
                password: password
            };            
            const response = await axios.post<string>('/api/reservations', request);
            const reservationCode = response.data;
            setReservationCode(reservationCode);      
        } catch (error: any) {
            var errorMessage = extractErrors(error.response.data)
            setError(errorMessage);
            return;
        }    

        if (createAccount && password) {
            try {   
                const request: AuthRequest = { email, password };
                await login(request);
            } catch (error: any) {
                handleAuthErrors(error);
                return;
            }   
        }    
    };

    return (
        // <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-black rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 p-6 transition-colors duration-300">
        <div className="max-w-2xl mx-auto mt-10 p-6 transition-colors duration-300">
            <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">Confirm Your Reservation</h1>

            {/* Car Model Summary */}
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-6 border border-gray-200 dark:border-neutral-800">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Vehicle Details</h2>
                <div className="flex flex-col sm:flex-row gap-6">
                    <img
                        src={getImageForCarModel(selectedModel.name)}
                        alt={selectedModel.name}
                        className="w-full sm:w-40 h-40 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold dark:text-white">{selectedModel.name}</h3>
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Daily Rate</p>
                                <p className="text-lg font-medium dark:text-white">€{selectedModel.baseDailyRate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
                                <p className="text-lg font-medium dark:text-white">€{(selectedModel.baseDailyRate / 10).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reservation Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 border border-gray-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Locations</h2>
                    <div className="space-y-3">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</p>
                            <p className="dark:text-white">{getLocationName(pickupLocationId)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Dropoff Location</p>
                            <p className="dark:text-white">{getLocationName(dropoffLocationId)}</p>
                        </div>
                    </div>
                </div>

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
            </div>

            {/* Total Cost */}
            <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-8 border border-gray-200 dark:border-neutral-800">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold dark:text-white">Estimated Total</h2>
                    <p className="text-2xl font-bold dark:text-white">
                        €{selectedModel.totalCost}
                    </p>
                </div>
            </div>

            {/* Guest Checkout Form */}
            {!isAuthenticated && (
                <div className="bg-gray-50 dark:bg-neutral-900 rounded-xl p-6 mb-8 border border-gray-200 dark:border-neutral-800">
                    <h2 className="text-xl font-semibold mb-4 dark:text-white">Contact Information</h2>
                    
                    <div className="space-y-4">
                        <LabeledInput
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            required
                            error={emailError}
                        />

                        <div className="flex items-center">
                            <input
                                id="create-account"
                                type="checkbox"
                                checked={createAccount}
                                onChange={() => setCreateAccount(prev => !prev)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                            />
                            <label htmlFor="create-account" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Create an account with this email
                            </label>
                        </div>

                        {createAccount && (
                            <LabeledInput
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Create a password"
                                required
                                error={passwordError}
                            />
                        )}
                    </div>
                </div>
            )}

            {/* Confirmation or Success Message */}
            {reservationCode ? (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800 text-center">
                    <h2 className="text-xl font-semibold mb-2 dark:text-white">Reservation Confirmed!</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Your reservation code is: <span className="font-bold">{reservationCode}</span>
                    </p>
                    <Button onClick={() => navigate('/')}>
                        Back to Home
                    </Button>
                </div>
            ) : (
                <div className="text-center">
                    <Button onClick={handleConfirmReservation}>
                        Confirm Reservation
                    </Button>
                    {error && (
                        <p className="mt-4 text-red-500 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>


        // <div className="max-w-2xl mx-auto mt-10 bg-gray-800 rounded-xl shadow-lg p-6 text-white">
        //     <h1 className="text-3xl font-bold mb-6 text-center">Reservation Summary</h1>

        //     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        //         <div className="bg-gray-700 rounded-lg p-4">
        //             <h2 className="text-xl font-semibold mb-2">Car Model</h2>
        //             <p>{selectedModel.name}</p>
        //             <p className="text-sm text-gray-300">Daily Rate: €{selectedModel.baseDailyRate}</p>
        //         </div>

        //         <div className="bg-gray-700 rounded-lg p-4">
        //             <h2 className="text-xl font-semibold mb-2">Locations</h2>
        //             <p>Pickup: {getLocationName(pickupLocationId)}</p>
        //             <p>Dropoff: {getLocationName(dropoffLocationId)}</p>
        //         </div>

        //         <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
        //             <h2 className="text-xl font-semibold mb-2">Date & Time</h2>
        //             <p>From: {new Date(from).toLocaleString()}</p>
        //             <p>To: {new Date(to).toLocaleString()}</p>
        //         </div>

        //         <div className="bg-gray-800 rounded-lg p-4 col-span-1 sm:col-span-2">
        //             <p className="text-xl font-semibold mb-2">Total Cost: €{selectedModel.totalCost}</p>
        //         </div>
        //     </div>

        //     {!isAuthenticated && (
        //         <>
        //             {/* Account Creation Checkbox */}
        //             <div className="col-span-1 mt-10 sm:col-span-2">
        //                 <label className="flex items-center space-x-2">
        //                     <input
        //                         type="checkbox"
        //                         checked={createAccount}
        //                         onChange={() => setCreateAccount(prev => !prev)}
        //                         className="form-checkbox h-4 w-4 text-blue-600"
        //                     />
        //                     <span>Create an account with this email</span>
        //                 </label>
        //             </div>

        //             {/* Email Input */}
        //             <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
        //                 <LabeledInput
        //                     label="Your Email"
        //                     type="email"
        //                     value={email}
        //                     onChange={(e) => setEmail(e.target.value)}
        //                     placeholder="Enter your email"
        //                     required
        //                     error={emailError}
        //                 />
        //             </div>

        //             {/* Password Input (conditionally shown) */}
        //             {createAccount && (
        //                 <div className="bg-gray-700 rounded-lg mt-2 p-4 col-span-1 sm:col-span-2">
        //                     <LabeledInput
        //                         label="Password"
        //                         type="password"
        //                         value={password}
        //                         onChange={(e) => setPassword(e.target.value)}
        //                         placeholder="Enter a password"
        //                         required
        //                         error={passwordError}
        //                     />
        //                 </div>
        //             )}
        //         </>
        //     )}      

        //     {reservationCode ? (
        //         <div className="mt-6 text-center">
        //             <p className="text-lg font-semibold">Your reservation has been confirmed!</p>
        //             <p className="text-sm text-gray-300">Reservation Code: {reservationCode}</p>
        //         </div>
        //     ) : (
        //         <div className="mt-6 text-center">
        //             <button
        //                 onClick={handleConfirmReservation}
        //                 className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
        //             >
        //                 Confirm Reservation
        //             </button>
        //         </div>
        //     )}

        //     {error && <p className="text-red-400 text-center mt-4">{error}</p>}
        // </div>
    );
};
