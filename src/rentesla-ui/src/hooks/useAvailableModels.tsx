import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { CarModelDto, LocationDto } from '../types/ApiResults';

export function useAvailableModels() {
    const [locations, setLocations] = useState<LocationDto[]>([]);
    const [availableModels, setAvailableModels] = useState<CarModelDto[]>([]);
    const [pickupId, setPickupId] = useState('');
    const [dropoffId, setDropoffId] = useState('');
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    
    useEffect(() => {
        axios.get<LocationDto[]>('/api/locations')
        .then(res => setLocations(res.data))
        .catch(console.error);
    }, []);
    
    const searchModels = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            axios.get<CarModelDto[]>('/api/car-models', {
                params: { available: true, pickupLocationId: pickupId, from, to }
            })
            .then(res => setAvailableModels(res.data))
            .catch(console.error);
        },
        [pickupId, from, to]
    );
    
    return {
        locations,
        availableModels,
        pickupId, setPickupId,
        dropoffId, setDropoffId,
        from, setFrom,
        to, setTo,
        searchModels,
    };
}