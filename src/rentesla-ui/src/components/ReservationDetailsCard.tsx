import { ReservationDto } from '../types/ApiResults';

type Props = { details: ReservationDto };

export const ReservationDetailsCard = ({ details }: Props) => {
  return (
    <div className="mt-6 bg-gray-800 p-4 rounded shadow space-y-2">
    <h3 className="text-lg font-semibold">Reservation Details</h3>
    <p><strong>Code:</strong> {details.reservationCode}</p>
    <p><strong>Car Model:</strong> {details.carModelName}</p>
    <p><strong>Pick-up Location:</strong> {details.pickUpLocationName}</p>
    <p><strong>Drop-off Location:</strong> {details.dropOffLocationName}</p>
    <p><strong>From:</strong> {new Date(details.from).toLocaleString()}</p>
    <p><strong>To:</strong> {new Date(details.to).toLocaleString()}</p>
    <p><strong>Total Cost:</strong> €{details.totalCost}</p>
    </div>
  );
};