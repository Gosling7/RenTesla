import React from 'react';

type LabeledInputProps = {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
};

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error
}) => (
  <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
    <h2 className="text-xl font-semibold mb-2">{label}</h2>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="w-full p-2 rounded-lg bg-gray-600 text-white"
      placeholder={placeholder}
      required={required}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </div>
);