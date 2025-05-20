import { CarModelDto, LocationDto } from '../types/ApiResults';
import { getImageForCarModel } from '../utils/carImageMap';
import { useNavigate } from 'react-router';

interface Props {
    locations: LocationDto[];
    model: CarModelDto;
    pickupId: string;
    dropoffId: string;
    from: string;
    to: string;
}

export const ModelCard = ({ locations, model, pickupId, dropoffId, from, to }: Props) => {
    const navigate = useNavigate();
    const onChoose = () =>
        navigate('/reservations/create', {
        state: { locations: locations, selectedModel: model, pickupLocationId: pickupId, dropoffLocationId: dropoffId, from, to }
    });
    
    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between">
            <img
                src={getImageForCarModel(model.name)}
                alt={model.name}
                className="w-40 h-40 object-cover rounded-lg"
            />
            <div className="flex-1 ml-4">
                <div className="font-semibold text-xl">{model.name}</div>
                <div className="mt-2">Daily Rate: €{model.baseDailyRate}</div>
                <div className="mt-2">Total Cost: €{model.totalCost}</div>
                {/* Choose Button */}
                <div className="mt-4">
                    <button
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full sm:w-auto"
                        onClick={onChoose}
                    >
                    Choose  
                    </button>
                </div>
            </div>
        </div>
    );
};