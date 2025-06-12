import { Menu } from "lucide-react";

export const HamburgerButton = ({ onClick }: { onClick: () => void; }) => (
    <button
        className="md:hidden p-2 focus:outline-none"
        onClick={onClick}
        aria-label="Toggle menu"
    >
        <Menu className="w-6 h-6" />
    </button>
);