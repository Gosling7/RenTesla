import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

export const DefaultLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
               < Outlet />
            </main>
        </div>
    );
}