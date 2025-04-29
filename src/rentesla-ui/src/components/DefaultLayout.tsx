import { Outlet } from 'react-router';
import { Navbar } from './Navbar';

const DefaultLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet /> {/* This will render the current page inside the layout */}
            </main>
        </div>
    );
}

export { DefaultLayout };