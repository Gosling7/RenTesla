interface Props {
    onClick?: () => void | Promise<void>;
    disabled?: boolean;
    children: React.ReactNode;
    type?: HTMLButtonElement["type"];
}

export const Button = ({ onClick, disabled = false, type, children }: Props) => {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className="py-3 px-4 rounded-2xl font-medium
            text-white bg-black enabled:hover:bg-neutral-700
            dark:text-black dark:bg-white enabled:dark:hover:bg-neutral-400
            disabled:opacity-50, disabled:cursor-not-allowed"                     
        >
            {children}
        </button>
    );
};

// export const Button = ({ onClick, disabled = false, label }: Props) => {
//     return (
//         <button
//             onClick={onClick}
//             disabled={disabled}
//             className="py-3 px-4 rounded-2xl font-medium
//             text-white bg-black hover:bg-neutral-700
//             dark:text-black dark:bg-white dark:hover:bg-neutral-400"                     
//         >
//             {label}
//         </button>
//     );
// };