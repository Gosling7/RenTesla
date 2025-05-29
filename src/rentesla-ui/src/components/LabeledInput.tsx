import React from 'react';

interface Props {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    required?: boolean;
    error?: string;
};

export const LabeledInput = ({
    label,
    type = 'text',
    value,
    onChange,
    placeholder = '',
    required = false,
    error
} : Props) => {
    const id = React.useId();

    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold mb-2 text-neutral-700 dark:text-neutral-300">
                {label}
            </label>

            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 rounded-xl  dark:border-neutral-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-neutral-100 dark:bg-neutral-800 dark:text-white transition-colors"
                placeholder={placeholder}
                required={required} 
            />

            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
        </div>
    );
};

// export const LabeledInput = ({
//     label,
//     type = 'text',
//     value,
//     onChange,
//     placeholder = '',
//     required = false,
//     error
// } : Props) => (
//     <div className="bg-gray-700 rounded-lg p-4 col-span-1 sm:col-span-2">
//         <h2 className="text-xl font-semibold mb-2">{label}</h2>
//         <input
//             type={type}
//             value={value}
//             onChange={onChange}
//             className="w-full p-2 rounded-lg bg-gray-600 text-white"
//             placeholder={placeholder}
//             required={required}
//         />
//         {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
//     </div>
// );