import { LocationDto } from '../types/ApiResults';

interface Props {
    label: string;
    locations: LocationDto[];
    value: string;
    onChange: (id: string) => void;
}
export const LocationSelector = ({ label, locations, value, onChange }: Props) => (
    <div className="flex flex-col">
        <label className="text-sm font-medium mb-1">{label}</label>
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className="p-2 rounded-md border bg-gray-700  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
        <option value="">Select a location</option>
        {locations.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
        ))}
        </select>
    </div>
);