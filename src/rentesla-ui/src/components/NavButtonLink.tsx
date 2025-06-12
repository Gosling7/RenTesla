import { Link } from "react-router"

interface Props {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export const NavButtonLink = ({ to, children, onClick }: Props) => {
    return (
        <Link
            to={to}
            className="px-4 py-2 rounded-2xl 
            bg-black text-white hover:bg-neutral-700
            dark:bg-white dark:text-black dark:hover:bg-neutral-400" 
            onClick={onClick}
        >
            {children}
        </Link>
    )
}