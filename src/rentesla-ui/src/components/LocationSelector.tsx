import { LocationDto } from '../types/ApiResults';

interface Props {
    label: string;
    locations: LocationDto[];
    value: string;
    onChange: (id: string) => void;
    error: string;
}
export const LocationSelector = ({ label, locations, value, onChange, error }: Props) => (
    <div className="flex flex-col text-black dark:text-white">
        <label className="font-medium mb-1">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="p-2.5 rounded-2xl focus:ring-2
            bg-gray-200 
            dark:bg-neutral-900"
        >
        <option value="">Select a location</option>
        {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
        ))}
        </select>
        {error && (
            <p className="text-red-500">{error}</p>
        )}
    </div>
);