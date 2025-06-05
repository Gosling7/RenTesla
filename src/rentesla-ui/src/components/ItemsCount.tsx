export const ItemsCount = ({ value } : { value: number }) => {
    return (
        <span className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-300 text-sm font-medium px-3 py-1 rounded-full">
            {value}
        </span>
    );
};