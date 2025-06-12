import { LocationSelector } from './LocationSelector';
import { DateTimePicker } from './DateTimePicker';
import { AvailableModelsList } from './AvailableModelsList';
import { useCallback, useEffect, useState } from 'react';
import { Button } from './Button';
import { extractErrorsFromProblemDetails } from '../utils/errorUtils';
import { CarModelDto, LocationDto } from '../types/ApiResults';
import { GetCarModels } from '../types/ApiRequests';
import axios from 'axios';
import { ProblemDetails } from '../types/ProblemDetails';

export const ReservationSearchContainer = () => {
    const [locations, setLocations] = useState<LocationDto[]>([]);
    const [availableModels, setAvailableModels] = useState<CarModelDto[] | null>([]);
    const [pickUpId, setPickUpId] = useState('');
    const [dropOffId, setDropOffId] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [problemDetails, setProblemDetails] = useState<ProblemDetails | null>(null)

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await axios.get<LocationDto[]>('/api/locations')
                setLocations(response.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchLocations();
    }, []);

    const requestParams: GetCarModels = {
        available: true,
        pickUpLocationId: pickUpId,
        dropOffLocationId: dropOffId,
        from: from,
        to: to
    };

    const searchAvailableModels = useCallback(       
        async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const response = await axios.get<CarModelDto[]>('/api/car-models', {
                    params: requestParams
                });

                setAvailableModels(response.data);
                setProblemDetails(null);
            } catch (error: any) {
                const problemDetails = error.response.data as ProblemDetails;
                setProblemDetails(problemDetails);
                setAvailableModels(null);
            }
        },
        [pickUpId, dropOffId, from, to]
    );

    const [isModelsVisible, setIsModelsVisible] = useState(false);
    
    useEffect(() => {
        if (availableModels && availableModels.length > 0) {
            setIsModelsVisible(true);
        } else {
            setIsModelsVisible(false);
        }
    }, [availableModels]);
    
    return (
        <div className={`w-full max-w-6xl transition-transform duration-500 ease-in-out rounded-xl overflow-hidden shadow-2xl
            bg-white/80 dark:bg-black/90`}
        >            
            <form 
                onSubmit={searchAvailableModels} 
                className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <LocationSelector
                    label="Pick-Up Location"
                    locations={locations}
                    value={pickUpId}
                    onChange={setPickUpId}
                    error={extractErrorsFromProblemDetails("pickUpLocationId", problemDetails)}
                />

                <LocationSelector
                    label="Drop-Off Location"
                    locations={locations}
                    value={dropOffId}
                    onChange={setDropOffId}
                    error={extractErrorsFromProblemDetails("dropOffLocationId", problemDetails)}
                />

                <DateTimePicker 
                    label="Pick-Up Date & Time" 
                    value={from} 
                    onChange={setFrom}
                    error={extractErrorsFromProblemDetails("from", problemDetails)}
                />

                <DateTimePicker 
                    label="Return Date & Time" 
                    value={to} 
                    onChange={setTo}
                    error={extractErrorsFromProblemDetails("to", problemDetails)}
                />

                <div className="md:col-span-2 lg:col-span-4 flex justify-center mt-2">
                    <Button type="submit">
                        Search Available Vehicles
                    </Button>
                </div>
            </form>
            
            <div className={`transition-all duration-500 overflow-hidden
                ${isModelsVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {availableModels && (
                    <div className="px-6 pb-6">
                        <AvailableModelsList
                            locations={locations}
                            models={availableModels}
                            pickupId={pickUpId}
                            dropoffId={dropOffId}
                            from={from}
                            to={to}
                        />
                    </div>
                )}                
            </div>
        </div>
    );
};