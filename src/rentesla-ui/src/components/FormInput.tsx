import React from 'react';

interface Props {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
}

export const FormInput = ({
    type,
    placeholder,
    value,
    onChange,
    error,
    required = false,
}: Props) => {
    return (
        <div className="space-y-1">
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                // className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required={required}
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
};