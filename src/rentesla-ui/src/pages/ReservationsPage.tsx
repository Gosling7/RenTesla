import { useState } from 'react';
import { ReservationDto } from '../types/ApiResults';
import { ReservationDetailsCard } from '../components/ReservationDetailsCard';
import { ReservationSearchForm } from '../components/ReservationSearchForm';
import { SectionCard } from '../components/SectionCard';
import { Header } from '../components/Header';

export const ReservationsPage = () => {
    const [details, setDetails] = useState<ReservationDto | null>(null);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Header 
                title="Find Your Reservation"
                subtitle="Enter your details to view your booking information"
            />

            <SectionCard>
                <ReservationSearchForm onResult={(res) => setDetails(res)} />
            </SectionCard>

            {details && 
                <ReservationDetailsCard details={details} />
            }
        </div>
    );
};

///////// Wygladajace poprawnie ///////////
// export const ReservationsPage = () => {
//     const [details, setDetails] = useState<ReservationDto | null>(null);

//     return (
//         <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 {/* Header */}
//                 <Header 
//                     title="Find Your Reservation"
//                     subtitle="Enter your details to view your booking information"
//                 />

//                 {/* Search Form */}
//                 <SectionCard>
//                     <ReservationSearchForm onResult={(res) => setDetails(res)} />
//                 </SectionCard>

//                 {/* Results Section */}
//                 {details && <ReservationDetailsCard details={details} />}
//             </div>
//         </div>        
//     );
// };


// export const ReservationsPage = () => {
//     const [code, setCode] = useState<string>('');
//     const [details, setDetails] = useState<ReservationDto | null>(null);
//     const [email, setEmail] = useState<string>('');
//     const { isAuthenticated, user } = useAuth();
//     const [codeError, setCodeError] = useState('');
//     const [emailError, setEmailError] = useState('');
    
//     // Automatically set the email if logged in
//     useEffect(() => {
//         if (isAuthenticated && user?.email) {
//             setEmail(user.email); 
//         }
//     }, [isAuthenticated, user?.email]);
    
//     const handleSearch = async () => {
//         try {
//             setCodeError('');
//             setEmailError('');
//             setDetails(null);
//             if (code === '') {
//                 setCodeError('Please enter a reservation code');
//                 return;
//             }
            
//             if (!isAuthenticated && email === '') {
//                 setEmailError('Please enter your email');
//                 return;
//             }
            
//             const response = await axios.get<ReservationDto>(`/api/reservations`, {
//                 params: {
//                     reservationCode: code,
//                     email: email
//                 }
//             });
            
//             if (!response.data)
//                 {
//                 setCodeError('No active reservation found');
//             } else {
//                 setDetails(response.data);
//             }
//         } catch (err: any) {
//             const errors = err.response?.data?.errors;
//             if (errors && typeof errors === 'object') {
//                 setCodeError(errors.ReservationCode?.[0] || '');
//                 setEmailError(errors.Email?.[0] || '');
//             }
//         }
//     };
    
//     return (
//         <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//                 {/* Header */}
//                 <div className="text-center mb-12">
//                     <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
//                         Find Your Reservation
//                     </h1>
//                     <p className="text-lg text-gray-600 dark:text-gray-300">
//                         Enter your details to view your booking information
//                     </p>
//                 </div>

//                 {/* Search Form */}
//                 <div className="dark:bg-neutral-900 rounded-xl shadow-md p-6 sm:p-8 mb-8 border border-gray-200 dark:border-neutral-800">
//                     <div className="space-y-6">
//                         <div>
//                             <LabeledInput 
//                                 label="Reservation Code"
//                                 type="text"
//                                 value={code}
//                                 onChange={(e) => setCode(e.target.value.toUpperCase())}
//                                 placeholder="Enter your reservation code"
//                                 error={codeError}
//                             />
//                         </div>

//                         {!isAuthenticated && (
//                             <div>
//                                 <LabeledInput 
//                                     label="Email"
//                                     type="email"
//                                     value={email}
//                                     onChange={(e) => setEmail(e.target.value)}
//                                     placeholder="Enter your email"
//                                     error={emailError}
//                                 />
//                             </div>
//                         )}

//                         <Button 
//                             onClick={handleSearch}
//                             disabled={!code || (!isAuthenticated && !email)}
//                         >
//                             Search Reservation
//                         </Button>
//                     </div>
//                 </div>

//                 {/* Results Section */}
//                 {details && <ReservationDetailsCard details={details} />}
//             </div>
//         </div>        
//     );
// };