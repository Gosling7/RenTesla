import { CarModelDto, LocationDto } from '../types/ApiResults';
import { getImageForCarModel } from '../utils/carImageMap';
import { useNavigate } from 'react-router';
import { Button } from './Button';

interface Props {
    locations: LocationDto[];
    model: CarModelDto;
    pickupId: string;
    dropoffId: string;
    from: string;
    to: string;
}

export const AvailableCarModelCard = ({ locations, model, pickupId, dropoffId, from, to }: Props) => {
    const navigate = useNavigate();
    const onChoose = () =>
        navigate('/reservations/create', {
        state: { locations: locations, selectedModel: model, pickupLocationId: pickupId, dropoffLocationId: dropoffId, from, to }
    });
    
    return (
        <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl shadow-sm hover:shadow-md overflow-hidden">
            <div className="p-5">
                <div className="flex flex-col sm:flex-row gap-5">
                    <div className="flex-shrink-0">
                        <img
                            src={getImageForCarModel(model.name)}
                            alt={model.name}
                            className="w-full h-40 sm:w-40 sm:h-32 object-cover rounded-lg"
                        />
                    </div>
                    
                    <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {model.name}
                        </h3>
                        
                        <div className="mt-3 grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Daily Rate</p>
                                <p className="text-lg font-medium dark:text-white">€{model.baseDailyRate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Hourly Rate</p>
                                <p className="text-lg font-medium dark:text-white">€{(model.baseDailyRate / 10).toFixed(2)}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Total</p>
                                <p className="text-xl font-bold dark:text-white">
                                    €{model.totalCost}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="px-5 pb-5 justify-center flex">
                <Button 
                    onClick={onChoose}
                >
                    Choose
                </Button>                
            </div>
        </div>
    );
};