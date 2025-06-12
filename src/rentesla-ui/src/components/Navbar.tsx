import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { NavButtonLink } from './NavButtonLink';
import { Button } from './Button';
import { LucideMoon, LucideSun } from 'lucide-react';
import { HamburgerButton } from './HamburgerButton';

export const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const toggleMenu = () => setIsMobileMenuOpen(prev => !prev);

    const isStaff = user?.roles.includes("Staff");

    const handleLogout = async () => {
        await logout();
        navigate('/', {
            state: { logoutSuccess: true }
        });
    };

    const [hasScrolled, setHasScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setHasScrolled(true);
            } else {
                setHasScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`sticky top-0 rounded-b-4xl bg-white w-full z-50 text-black font-medium dark:bg-black dark:text-white
            ${hasScrolled ? "shadow-md" : "shadow-none"}`}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center h-16 justify-between">
                <Link to="/" className="text-2xl font-bold mr-8" onClick={() => setIsMobileMenuOpen(false)}>RenTesla</Link>                

                {/* Desktop Menu */}
                <div className="hidden md:flex justify-between items-center w-full">
                    
                    {/* Left side: logo + main links */}
                    <ul className="flex items-center gap-6">
                        <li><Link to="/about" className="hover:underline">About Us</Link></li>
                        <li><Link to="/reservations" className="hover:underline">Find a Reservation</Link></li>
                    </ul>

                    {/* Right side: auth + dark mode */}
                    <ul className="flex items-center gap-4">
                        {!isAuthenticated && (
                            <>
                                <li><NavButtonLink to="/login">Login</NavButtonLink></li>
                                <li><NavButtonLink to="/register">Register</NavButtonLink></li>
                            </>
                        )}

                        {isAuthenticated && (
                            <>
                                <li><Button onClick={handleLogout}>Logout</Button></li>
                                <li><Link to="/user" className="hover:underline">Account</Link></li>
                            </>
                        )}

                        {isAuthenticated && isStaff && (
                            <li><Link to="/staff" className="hover:underline">Staff</Link></li>
                        )}

                        <li>
                            <DarkModeToggleButton />
                        </li>
                    </ul>
                </div>

                <div className="md:hidden">
                    <HamburgerButton onClick={toggleMenu} />
                </div>
            </div>        

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <ul className="md:hidden px-4 pb-4 space-y-4 flex items-start flex-col">
                    <li>
                        <Link to="/about" className="hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                            About Us
                        </Link>
                    </li>
                    <li>
                        <Link to="/reservations" className="block hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                            Find a Reservation
                        </Link>
                    </li>
                    
                    {!isAuthenticated && (
                        <>
                            <li>
                                <NavButtonLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    Login
                                </NavButtonLink>
                            </li>
                            <li>  
                                <NavButtonLink to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    Register                            
                                </NavButtonLink>
                            </li>                         
                            
                        </>
                    )}
                    
                    {isAuthenticated && (
                        <>
                            <li>
                                <Link to="/user" className="block hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                                    Account
                                </Link>
                            </li>
                            <li>
                                <Button onClick={handleLogout}>Logout</Button>
                            </li>
                        </>
                    )}

                    {isAuthenticated && isStaff && (
                        <li>
                            <Link to="/staff" className="block hover:underline" onClick={() => setIsMobileMenuOpen(false)}>
                                Staff
                            </Link>
                        </li>
                    )}                    

                    <DarkModeToggleButton />
                </ul>
            )}
        </nav>
    );
};

const DarkModeToggleButton = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    
    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-neutral-900"
        >
            {darkMode ? <LucideSun /> : <LucideMoon />}
        </button>
    );
};