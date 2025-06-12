import { Link } from "react-router"

export const Footer = () => {
    return (
        <footer className="bg-white dark:bg-black text-neutral-900 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                <div>
                    <h6 className="text-lg font-semibold text-black mb-4 dark:text-white">RenTesla</h6>
                    <p className="text-sm dark:text-gray-300">Your premier destination for electric vehicle rentals. Experience the future of driving with our curated selection of Tesla cars.</p>                        
                </div>
                <div>
                    <h6 className="text-lg font-semibold text-black mb-4 dark:text-white">Explore</h6>
                    <ul className="text-sm space-y-2 dark:text-gray-300">
                        <li><Link to="/about" className="hover:text-gray-400">About Us</Link></li>
                        <li><Link to="/reservations" className="hover:text-gray-400">Make a Reservation</Link></li>
                        <li><Link to="/#" className="hover:text-gray-400">Contact Us</Link></li>
                    </ul>
                </div>
                <div>
                    <h6 className="text-lg font-semibold text-black mb-4 dark:text-white">Customer Service</h6>
                    <ul className="text-sm space-y-2 dark:text-gray-300">
                        <li><Link to="/#" className="hover:text-gray-400">FAQ</Link></li>
                        <li><Link to="/#" className="hover:text-gray-400">Support</Link></li>
                        <li><Link to="/#" className="hover:text-gray-400">Terms & Conditions</Link></li>
                        <li><Link to="/#" className="hover:text-gray-400">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h6 className="text-lg font-semibold text-black mb-4 dark:text-white">Newsletter</h6>
                    <p className="text-sm mb-2 dark:text-gray-300">Subscribe to our newsletter for exclusive deals and updates.</p>
                    <div className="flex">
                        <input type="email" className="bg-gray-100 text-black border border-gray-700 rounded-l-md py-2 px-3 w-full" placeholder="Your email"/>
                        <button className="py-3 px-4 rounded-r-2xl font-medium
                            text-white bg-black enabled:hover:bg-neutral-700
                            dark:text-black dark:bg-white enabled:dark:hover:bg-neutral-400
                            disabled:opacity-50, disabled:cursor-not-allowed">
                            Subscribe
                        </button>
                    </div>
                </div>
            </div>
            <div className="mt-8 py-2 text-center text-sm text-gray-400">
                <p>&copy; {new Date().getFullYear()} RenTesla. All rights reserved.</p>
                <p className="mt-1">Designed & Developed by Michał Gąska</p>
            </div>
        </footer>
    );
};