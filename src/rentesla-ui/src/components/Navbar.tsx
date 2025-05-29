import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { NavButtonLink } from './NavButtonLink';

export const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, user } = useAuth();

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

    const { darkMode, toggleDarkMode } = useTheme()

    return (
        <nav className={`sticky top-0 rounded-b-4xl bg-white w-full z-50 text-black font-medium dark:bg-black dark:text-white
            ${hasScrolled ? "shadow-md" : "shadow-none"}`}
        >
            <div className="max-w-7xl mx-auto px-4 flex items-center h-16">

                <div className="flex items-center">
                    <Link to="/" className="hover:underline text-2xl font-bold mr-8">RenTesla</Link>
                    <ul className="flex gap-6 items-center">
                        <li><Link to="/about" className="hover:underline">About Us</Link></li>
                        <li><Link to="/reservations" className="hover:underline">Find a Reservation</Link></li>
                    </ul>
                </div>

                <div className="flex items-center gap-4 ml-auto">
                {isAuthenticated && (
                    <Link to="/user" className="hover:underline">
                        Account
                    </Link>
                )}

                {isAuthenticated && isStaff && (
                    <Link to="/staff" className="hover:underline ml-4">
                        Staff
                    </Link>
                )}

                {!isAuthenticated && (
                    <>
                        <NavButtonLink to="/login">Login </NavButtonLink>
                        <NavButtonLink to="/register">Register </NavButtonLink>
                    </>
                )}

                {isAuthenticated && (
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-4"
                    >
                        Logout
                    </button>
                )}

                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700"
                    aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>

                </div>
            </div>
        </nav>
        // -Czarny navbar- //
        // <nav className="sticky top-0 rounded-b-4xl bg-black shadow-md w-full z-50 text-white font-medium">
        //     <div className="max-w-7xl mx-auto px-4 flex items-center h-16">

        //         <div className="flex items-center">
        //             <Link to="/" className="hover:underline text-2xl font-bold mr-8">RenTesla</Link>
        //             <ul className="flex gap-6 items-center">
        //                 <li><Link to="/about" className="hover:underline">About</Link></li>
        //                 <li><Link to="/reservations" className="hover:underline">Reservations</Link></li>
        //             </ul>
        //         </div>

        //         <div className="flex items-center gap-4 ml-auto">
        //         {isAuthenticated && (
        //             <Link to="/user" className="hover:underline">
        //                 Account
        //             </Link>
        //         )}

        //         {isAuthenticated && isStaff && (
        //             <Link to="/staff" className="hover:underline ml-4">
        //                 Staff
        //             </Link>
        //         )}

        //         {!isAuthenticated && (
        //             <>
        //                 <Link
        //                     to="/register"
        //                     className="bg-white text-black px-4 py-2 rounded-2xl hover:bg-gray-200 transition ml-4" 
        //                 >
        //                     Register
        //                 </Link>
        //                 <Link
        //                     to="/login"
        //                     className="bg-white text-black px-4 py-2 rounded-2xl hover:bg-gray-200 transition ml-2" 
        //                 >
        //                     Login
        //                 </Link>
        //             </>
        //         )}

        //         {isAuthenticated && (
        //             <button
        //                 onClick={handleLogout}
        //                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded ml-4"
        //             >
        //                 Logout
        //             </button>
        //         )}
        //         </div>
        //     </div>
        // </nav>
    );
};


// import { Link, useNavigate } from 'react-router';
// import { useAuth } from '../contexts/AuthContext';

// export const Navbar = () => {
//     const navigate = useNavigate();
//     const { isAuthenticated, logout, user } = useAuth();
    
//     const isStaff = user?.roles.includes("Staff");
    
//     const handleLogout = async () => {
//         await logout();
//         navigate('/', {
//             state: { logoutSuccess: true }
//         });
//     };
    
//     return (
//         <nav className="fixed top-0 bg-white shadow-md w-full z-50 rounded-b-3xl text-black font-medium">
//             <div className="max-w-7xl mx-auto px-4 flex items-center h-16 relative">
            
//                 <div className="mr-auto flex gap-5">
//                     <ul className="flex gap-6 items-center">
//                         <li><Link to="/" className="hover:underline text-2xl font-bold">RenTesla</Link></li>
//                         <li><Link to="/about" className="hover:underline">About</Link></li>
//                         <li><Link to="/reservations" className="hover:underline">Reservations</Link></li>
//                     </ul>
//                 </div>           
                
//                 <div className="ml-auto flex items-center gap-6">
//                 {isAuthenticated && (
//                     <Link to="/user" className="hover:underline text-white">
//                         Account
//                     </Link>
//                 )}
                
//                 {isAuthenticated && isStaff && (
//                     <Link to="/staff" className="hover:underline text-white">
//                         Staff
//                     </Link>
//                 )}
                
//                 {!isAuthenticated && (
//                     <>
//                         <Link
//                             to="/register"
//                             className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-neutral-700 transition"
//                         >
//                             Register
//                         </Link>
//                         <Link
//                             to="/login"
//                             className="bg-black text-white px-4 py-2 rounded-2xl hover:bg-neutral-700 transition"
//                         >
//                             Login
//                         </Link>
//                     </>
//                 )}
                
//                 {isAuthenticated && (
//                     <button
//                         onClick={handleLogout}
//                         className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
//                     >
//                         Logout
//                     </button>
//                 )}
//                 </div>
//             </div>
//         </nav>
//     );
// };



{/* <nav className="bg-white fixed w-full top-0 z-10 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                <a href="/" className="text-xl font-bold text-gray-900">
                    Ren Tesla
                </a>
                </div>
                <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                    <a
                    href="/about"
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                    >
                    About
                    </a>
                    <a
                    href="/reservations"
                    className="text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
                    >
                    Reservations
                    </a>
                </div>
                </div>
            </div>
            <div className="hidden md:block">
                <div className="flex items-center ml-4 space-x-4">
                <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Register
                </button>
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Login
                </button>
                </div>
            </div>
            {/* Mobile menu button (you'd typically add state and logic for this) */}
        //     <div className="-mr-2 flex md:hidden">
        //         <button
        //         type="button"
        //         className="bg-gray-100 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
        //         aria-expanded="false"
        //         >
        //         <span className="sr-only">Open main menu</span>
        //         {/* Heroicon name: outline/bars-3 */}
        //         <svg
        //             className="h-6 w-6"
        //             xmlns="http://www.w3.org/2000/svg"
        //             fill="none"
        //             viewBox="0 0 24 24"
        //             stroke="currentColor"
        //             aria-hidden="true"
        //         >
        //             <path
        //             strokeLinecap="round"
        //             strokeLinejoin="round"
        //             strokeWidth="2"
        //             d="M4 6h16M4 12h16M4 18h16"
        //             />
        //         </svg>
        //         </button>
        //     </div>
        //     </div>
        // </div>

        {/* Mobile menu, show/hide based on menu state. */}
        {/* <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
                href="/about"
                className="bg-gray-100 text-gray-900 block px-3 py-2 rounded-md text-base font-medium"
            >
                About
            </a>
            <a
                href="/reservations"
                className="text-gray-600 hover:bg-gray-100 block px-3 py-2 rounded-md text-base font-medium"
            >
                Reservations
            </a>
            </div>
            <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center justify-around">
                <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Register
                </button>
                <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                Login
                </button>
            </div>
            </div>
        </div> */}
        // </nav> */}