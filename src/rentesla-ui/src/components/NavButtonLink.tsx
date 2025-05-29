import { Link } from "react-router"

interface Props {
    to: string;
    children: React.ReactNode;
}

export const NavButtonLink = ({ to, children }: Props) => {
    return (
        <Link
            to={to}
            className="px-4 py-2 rounded-2xl  transition ml-2 
            bg-black text-white hover:bg-neutral-700
            dark:bg-white dark:text-black dark:hover:bg-neutral-400" 
        >
            {children}
        </Link>
    )
}