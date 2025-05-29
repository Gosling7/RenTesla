import { ModelCard } from './ModelCard';
import { CarModelDto, LocationDto } from '../types/ApiResults';
import { useEffect, useState } from 'react';

interface Props {
    locations: LocationDto[];
    models: CarModelDto[];
    pickupId: string;
    dropoffId: string;
    from: string;
    to: string;
}

export const AvailableModelsList = ({ locations, models, pickupId, dropoffId, from, to }: Props) => {
    const [isVisible, setIsVisible] = useState(false);
    
    useEffect(() => {
        // If models are available, set isVisible to true with a slight delay
        // This delay ensures the initial opacity-0 state is applied before transitioning
        if (models.length > 0) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 200); // A small delay (e.g., 50ms)
            return () => clearTimeout(timer); // Cleanup the timer if component unmounts or models change
        } else {
            // If models are no longer available, reset isVisible to false
            // This prepares the animation to play again if new models are loaded later
            setIsVisible(false);
        }
    }, [models]); // Re-run this effect whenever the 'models' prop changes
    
    if (!models.length) {
        return null;
    }

    return (
        // <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <div
            className={`mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-all duration-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
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