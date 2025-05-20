import { ModelCard } from './ModelCard';
import { CarModelDto, LocationDto } from '../types/ApiResults';

interface Props {
    locations: LocationDto[];
    models: CarModelDto[];
    pickupId: string;
    dropoffId: string;
    from: string;
    to: string;
}

export const AvailableModelsList = ({ locations, models, pickupId, dropoffId, from, to }: Props) => {
    if (!models.length) {
        return <p className="text-sm text-gray-400 mt-6">No models available (or not searched yet).</p>;
    }
    return (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {models.map(model => (
            <ModelCard
            key={model.id}
            locations={locations}
            model={model}
            pickupId={pickupId}
            dropoffId={dropoffId}
            from={from}
            to={to}
            />
        ))}
        </div>
    );
};