import React from 'react';
import { ReservationDto, ReservationStatus } from '../types/ApiResults';
import { Button } from './Button';

interface ReservationItemProps {
    reservation: ReservationDto;
    onConfirmReturn?: (id: string) => void;
}

export const ReservationItem = ({ reservation, onConfirmReturn }: ReservationItemProps) => {
    const isActive = reservation.status === ReservationStatus.Active;
    const isPendingReturn = reservation.status === ReservationStatus.PendingReturn;
    const isCompleted = reservation.status === ReservationStatus.Completed;
    const isCancelled = reservation.status === ReservationStatus.Cancelled;
    
    const statusColor = isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
        isPendingReturn ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
        isCompleted ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
        'bg-gray-100 text-gray-800 dark:bg-neutral-800 dark:text-gray-300';

        const isReturnConfirmed = 
    reservation.status === ReservationStatus.PendingReturn
    || reservation.status === ReservationStatus.Completed;

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden transition-all duration-300">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold dark:text-white">
                                {reservation.carModelName}
                            </h3>
                            {/* <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusColor}`}>
                                {reservation.status.replace(/([A-Z])/g, ' $1').trim()}
                            </span> */}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Pickup Location</p>
                                <p className="dark:text-white">{reservation.pickUpLocationName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Dropoff Location</p>
                                <p className="dark:text-white">{reservation.dropOffLocationName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">From</p>
                                <p className="dark:text-white">{new Date(reservation.from).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">To</p>
                                <p className="dark:text-white">{new Date(reservation.to).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-end">
                        <p className="text-2xl font-bold dark:text-white">
                            €{reservation.totalCost}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Code: {reservation.reservationCode}
                        </p>
                        
                        <div className="flex flex-col items-end">
                            {onConfirmReturn && (
                                <>
                                    <Button
                                        onClick={() => onConfirmReturn(reservation.id)}
                                        disabled={isReturnConfirmed}
                                    >
                                        {isReturnConfirmed ? "You've confirmed return" : 'Confirm Return'}
                                    </Button>

                                    {isReturnConfirmed && reservation.status !== ReservationStatus.Active && (
                                        <p className="mt-2 dark:text-white">Awaiting Staff Confirmation</p>
                                    )}
                                </>
                            )}
                        </div>

                        {/* {onConfirmReturn && (
                            <div className="flex flex-col items-end">
                                {isPendingReturn ? (
                                    <Button
                                        onClick={() => onConfirmReturn(reservation.id)}
                                        label="Confirm Return"
                                        //className="w-full sm:w-auto"
                                    />
                                ) : isActive ? (
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Active reservation
                                    </p>
                                ) : null}
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </div>
    );
};


// export const ReservationItem: React.FC<ReservationItemProps> = ({ reservation, onConfirmReturn }) => {
//     const isReturnConfirmed = 
//     reservation.status === ReservationStatus.PendingReturn
//     || reservation.status === ReservationStatus.Completed;
    
//     return (
//         <li className="bg-gray-800 p-4 rounded-3xl shadow">
//             <p><strong>Car:</strong> {reservation.carModelName}</p>
//             <p><strong>From:</strong> {new Date(reservation.from).toLocaleString()}</p>
//             <p><strong>To:</strong> {new Date(reservation.to).toLocaleString()}</p>
//             <p><strong>Pickup:</strong> {reservation.pickUpLocationName}</p>
//             <p><strong>Dropoff:</strong> {reservation.dropOffLocationName}</p>
//             <p><strong>Total Cost:</strong> €{reservation.totalCost}</p>
//             <p><strong>Reservation Code:</strong> {reservation.reservationCode}</p>
//             {onConfirmReturn && (
//                 <>
//                     <button
//                         onClick={() => onConfirmReturn(reservation.id)}
//                         className="mt-2"
//                         disabled={isReturnConfirmed}
//                     >
//                         {isReturnConfirmed ? "You've confirmed return" : 'Confirm Return'}
//                     </button>
//                     {!isReturnConfirmed && reservation.status !== ReservationStatus.Active && (
//                         <p>Awaiting our return confirmation</p>
//                     )}
//                 </>
//             )}
//         </li>
//     );
// };