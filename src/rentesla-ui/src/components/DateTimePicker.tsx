import { useEffect, useState } from "react";

interface Props {
    label: string;
    value: string;
    onChange: (v: string) => void;
    error: string;
}

export const DateTimePicker = ({ label, value, onChange, error }: Props) => {
    const [minDateTime, setMinDateTime] = useState("");

    useEffect(() => {
        // Format current date-time as "YYYY-MM-DDTHH:mm"
        const now = new Date();                
        const pad = (n: number) => n.toString().padStart(2, "0");  

        const year = now.getFullYear();
        const month = pad(now.getMonth());
        const day = pad(now.getDay());
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());

        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
        setMinDateTime(formattedDate);
    }, []);

    return (
        <div className="flex flex-col text-black dark:text-white">
            <label className="font-medium mb-1">{label}</label>
            <input
                type="datetime-local"
                value={value}
                min={minDateTime}
                onChange={e => onChange(e.target.value)}
                className="p-2.5 rounded-2xl focus:ring-2
                bg-gray-200 
                dark:bg-neutral-900"
            />
            {error && (
                <p className="text-red-500">{error}</p>
            )}
        </div>
    );
};