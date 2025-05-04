import { Link, useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout, userRoles } = useAuth();

    const isStaff = userRoles?.includes("Staff");

    const handleLogout = async () => {
        await logout();
        navigate('/', {
            state: { logoutSuccess: true }
        });
      };

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

                <div className="ml-auto flex items-center gap-6">
                {isAuthenticated && (
                    <Link to="/user" className="hover:underline text-white">
                        Account
                    </Link>
                )}

                {isAuthenticated && isStaff && (
                    <Link to="/staff" className="hover:underline text-white">
                        Staff
                    </Link>
                )}

                {!isAuthenticated && (
                    <>
                      <Link
                        to="/register"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Register
                      </Link>
                      <Link
                        to="/login"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                      >
                        Login
                      </Link>
                    </>
                )}

                {isAuthenticated && (
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
                  >
                    Logout
                  </button>
                )}
                </div>
            </div>
        </nav>
    );
};

export { Navbar };