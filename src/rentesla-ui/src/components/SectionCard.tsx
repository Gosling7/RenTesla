import React from 'react';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export const SectionCard = ({ children, className = '' }: Props) => {
    return (
        <div
            className={`dark:bg-neutral-900 rounded-2xl shadow-md p-6 sm:p-8 mb-8 border border-gray-200 dark:border-neutral-800 ${className}`}
        >
            {children}
        </div>
    );
};