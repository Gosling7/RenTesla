import React from 'react';
import { ReservationDto, ReservationStatus } from '../types/ApiResults';

type ReservationItemProps = {
    reservation: ReservationDto;
    onConfirmReturn: (id: string) => void;
}

export const ReservationItem: React.FC<ReservationItemProps> = ({ reservation, onConfirmReturn }) => {
    const isReturnConfirmed = 
    reservation.status === ReservationStatus.PendingReturn
    || reservation.status === ReservationStatus.Completed;
    
    return (
        <li className="bg-gray-800 p-4 rounded-3xl shadow">
            <p><strong>Car:</strong> {reservation.carModelName}</p>
            <p><strong>From:</strong> {new Date(reservation.from).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(reservation.to).toLocaleString()}</p>
            <p><strong>Pickup:</strong> {reservation.pickUpLocationName}</p>
            <p><strong>Dropoff:</strong> {reservation.dropOffLocationName}</p>
            <p><strong>Total Cost:</strong> €{reservation.totalCost}</p>
            <p><strong>Reservation Code:</strong> {reservation.reservationCode}</p>
            {onConfirmReturn && (
                <>
                    <button
                        onClick={() => onConfirmReturn(reservation.id)}
                        className="mt-2"
                        disabled={isReturnConfirmed}
                    >
                        {isReturnConfirmed ? "You've confirmed return" : 'Confirm Return'}
                    </button>
                    {!isReturnConfirmed && reservation.status !== ReservationStatus.Active && (
                        <p>Awaiting our return confirmation</p>
                    )}
                </>
            )}
        </li>
    );
};