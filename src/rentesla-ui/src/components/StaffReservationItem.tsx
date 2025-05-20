import { ReservationDto, ReservationStatus } from '../types/ApiResults';

interface Props {
    reservation: ReservationDto;
    onConfirmReturn: (id: string) => void;
};

export const StaffReservationItem = ({ reservation, onConfirmReturn }: Props) => {
    return (
        <li className="bg-gray-800 p-4 rounded shadow">
            <p><strong>Car:</strong> {reservation.carModelName}</p>
            <p><strong>From:</strong> {new Date(reservation.from).toLocaleString()}</p>
            <p><strong>To:</strong> {new Date(reservation.to).toLocaleString()}</p>
            <p><strong>Status:</strong> {ReservationStatus[reservation.status]}</p>
            <p><strong>Reservation Code:</strong> {reservation.reservationCode}</p>
            <p><strong>Total Cost:</strong> €{reservation.totalCost}</p>
            <button
                className="mt-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
                disabled={reservation.status === ReservationStatus.Completed}
                onClick={() => onConfirmReturn(reservation.id)}
            >
                {reservation.status === ReservationStatus.Completed ? 'Confirmed' : 'Confirm Return'}
            </button>
        </li>
    );
};