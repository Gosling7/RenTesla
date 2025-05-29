import { LocationSelector } from './LocationSelector';
import { DateTimePicker } from './DateTimePicker';
import { AvailableModelsList } from './AvailableModelsList';
import { useAvailableModels } from '../hooks/useAvailableModels';
import { useEffect, useState } from 'react';

export const ReservationSearchContainer = () => {
    const {
        locations,
        pickupId, setPickupId,
        dropoffId, setDropoffId,
        from, setFrom,
        to, setTo,
        availableModels,
        searchModels,
    } = useAvailableModels();
    const [isModelsVisible, setIsModelsVisible] = useState(false);
    
    useEffect(() => {
        if (availableModels && availableModels.length > 0) {
            setIsModelsVisible(true);
        } else {
            setIsModelsVisible(false);
        }
    }, [availableModels]);
    
    return (
        <div className={`w-full max-w-6xl transition-all duration-500 ease-in-out rounded-xl overflow-hidden shadow-2xl
            bg-white/80 dark:bg-black/90`}
        >            
            <form 
                onSubmit={searchModels} 
                className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                <LocationSelector
                    label="Pick-Up Location"
                    locations={locations}
                    value={pickupId}
                    onChange={setPickupId}
                />

                <LocationSelector
                    label="Drop-Off Location"
                    locations={locations}
                    value={dropoffId}
                    onChange={setDropoffId}
                />

                <DateTimePicker 
                    label="Pick-Up Date & Time" 
                    value={from} 
                    onChange={setFrom}
                />

                <DateTimePicker 
                    label="Return Date & Time" 
                    value={to} 
                    onChange={setTo}
                />

                <div className="md:col-span-2 lg:col-span-4 flex justify-center mt-2">
                    <button 
                        type="submit"
                        className="py-3 px-4 rounded-2xl font-medium
                        text-white bg-black hover:bg-neutral-700
                        dark:text-black dark:bg-white dark:hover:bg-neutral-400" 
                    >
                        Search Available Vehicles
                    </button>
                </div>
            </form>
            
            {/* Results Section */}
            <div className={`transition-all duration-500 overflow-hidden
                ${isModelsVisible ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className="px-6 pb-6">
                    <AvailableModelsList
                        locations={locations}
                        models={availableModels}
                        pickupId={pickupId}
                        dropoffId={dropoffId}
                        from={from}
                        to={to}
                    />
                </div>
            </div>
        </div>


        // <div
        //     className={`p-6 mt-6 overflow-hidden transition-transform duration-500 rounded-3xl ${
        //         isModelsVisible ? 'max-h-[1000px] pb-6' : 'max-h-[250px] pb-6'
        //     }
        //     bg-white
        //     dark:bg-black`}
        // >
        //     <form onSubmit={searchModels} className="grid grid-cols-1 w-auto sm:grid-cols-2 lg:grid-cols-4 gap-6">
        //         <LocationSelector
        //             label="Departure"
        //             locations={locations}
        //             value={pickupId}
        //             onChange={setPickupId}
        //         />

        //         <LocationSelector
        //             label="Return"
        //             locations={locations}
        //             value={dropoffId}
        //             onChange={setDropoffId}
        //         />

        //         <DateTimePicker 
        //             label="Pick Up Date & Time" 
        //             value={from} 
        //             onChange={setFrom} 
        //         />

        //         <DateTimePicker 
        //             label="Return Date & Time" 
        //             value={to} 
        //             onChange={setTo} 
        //         />

        //         <div className="col-span-full flex justify-center">
        //             <button className="rounded-2xl!">Search</button>
        //         </div>
        //     </form>
            
        //     <div className={`mt-6 ${!isModelsVisible ? 'hidden' : ''}`}>
        //         <AvailableModelsList
        //             locations={locations}
        //             models={availableModels}
        //             pickupId={pickupId}
        //             dropoffId={dropoffId}
        //             from={from}
        //             to={to}
        //         />
        //     </div>
        // </div>
    );
}