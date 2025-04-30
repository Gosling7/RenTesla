import { Link } from 'react-router';

const Navbar = () => {
    return (
        <nav className="sticky top-0 bg-black shadow-md w-full z-50 rounded-b-2xl">
            <div className="max-w-7xl mx-auto px-4 flex items-center h-16 relative">

            <div className="mr-auto flex gap-5">
                <ul className="flex gap-6">
                    <li><Link to="/" className="hover:underline">RenTesla</Link></li>
                    <li><Link to="/about" className="hover:underline">About</Link></li>
                    <li><Link to="/reservations" className="hover:underline">Reservations</Link></li>
                </ul>
            </div>

            {/* Center links */}
            {/* <div className="absolute left-1/2 transform -translate-x-1/2">
                <ul className="flex gap-6">
                    <li><Link to="/" className="hover:underline">Home</Link></li>
                </ul>
            </div> */}

            {/* Register button stays at the right */}
            <div className="ml-auto flex gap-5">
                <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Register
                </Link>
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                    Login
                </Link>

                </div>
            </div>
        </nav>
    );
};

export { Navbar };