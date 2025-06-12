import { ReservationDto, ReservationStatus } from '../types/ApiResults';
import { Button } from './Button';

interface ReservationItemProps {
    reservation: ReservationDto;
    onConfirmReturn?: (id: string) => void;
}

export const ReservationItem = ({ reservation, onConfirmReturn }: ReservationItemProps) => {
    const isReturnConfirmed = reservation.status === ReservationStatus.PendingReturn
        || reservation.status === ReservationStatus.Completed;

    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-800 overflow-hidden">
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-xl font-semibold dark:text-white">
                                {reservation.carModelName}
                            </h3>
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
                    </div>
                </div>
            </div>
        </div>
    );
};