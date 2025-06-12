import { ReservationDto, ReservationStatus } from '../types/ApiResults';
import { Button } from './Button';

interface Props {
    reservation: ReservationDto;
    onConfirmReturn: (id: string) => void;
};

export const StaffReservationItem = ({ reservation, onConfirmReturn }: Props) => {
    return (
        <li className="bg-gray-50 border border-gray-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white p-6 rounded-3xl shadow-md">
            <p><strong>Car:</strong> {reservation.carModelName}</p>
            <p><strong>From:</strong> {new Date(reservation.from).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(reservation.to).toLocaleString()}</p>
            <p><strong>Status:</strong> {ReservationStatus[reservation.status]}</p>
            <p><strong>Reservation Code:</strong> {reservation.reservationCode}</p>
            <p><strong>Total Cost:</strong> €{reservation.totalCost}</p>
            
            <div className="mt-4">
                <Button
                    disabled={reservation.status === ReservationStatus.Completed}
                    onClick={() => onConfirmReturn(reservation.id)}
                >
                    {reservation.status === ReservationStatus.Completed ? 'Confirmed' : 'Confirm Return'}
                </Button>
            </div>
        </li>
    );
};