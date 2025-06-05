import { ReservationDto } from '../types/ApiResults';

type Props = { details: ReservationDto };

export const ReservationDetailsCard = ({ details }: Props) => {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-neutral-800 transition-all duration-300">
            <div className="bg-neutral-200 dark:bg-neutral-700 px-6 py-4 dark:text-white">
                <h3 className="text-xl font-bold">Reservation Details</h3>
            </div>
            
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem 
                        label="Reservation Code" 
                        value={details.reservationCode} 
                    />
                    <DetailItem 
                        label="Car Model" 
                        value={details.carModelName} 
                    />
                    <DetailItem 
                        label="Pick-up Location" 
                        value={details.pickUpLocationName} 
                    />
                    <DetailItem 
                        label="Drop-off Location" 
                        value={details.dropOffLocationName} 
                    />
                    <DetailItem 
                        label="From" 
                        value={new Date(details.from).toLocaleString()} 
                    />
                    <DetailItem 
                        label="To" 
                        value={new Date(details.to).toLocaleString()} 
                    />
                    <div className="md:col-span-2">
                        <DetailItem 
                            label="Total Cost" 
                            value={`€${details.totalCost}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const DetailItem = ({ label, value }: { label: string, value: string, }) => (
    <div className="p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800">
        <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{label}</p>
        <p className="mt-1 text-lg text-black dark:text-white">
            {value}
        </p>
    </div>
);