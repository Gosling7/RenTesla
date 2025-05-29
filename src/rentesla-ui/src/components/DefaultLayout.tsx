import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const DefaultLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}