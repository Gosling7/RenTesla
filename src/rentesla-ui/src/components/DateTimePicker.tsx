interface Props {
    label: string;
    value: string;
    onChange: (v: string) => void;
}

export const DateTimePicker = ({ label, value, onChange }: Props) => (
    <div className="flex flex-col text-black dark:text-white">
        <label className="font-medium mb-1">{label}</label>
        <input
            type="datetime-local"
            value={value}
            onChange={e => onChange(e.target.value)}
            // className="p-2 rounded-md border bg-gray-700  border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            className="p-2.5 rounded-2xl focus:ring-2
            bg-gray-200 
            dark:bg-neutral-900"
        />
    </div>
);