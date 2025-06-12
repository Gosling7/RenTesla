import { ReservationSearchContainer } from '../components/ReservationSearchContainer'

export const HomePage = () => {
    return (
        <div className="relative min-h-screen">
                        
            <div className=" rounded-4xl absolute inset-0 bg-cover bg-center z-[-1]
                bg-[url('/images/home-page-light-bg.jpg')]
                dark:bg-[url('/images/home-page-dark-bg.jpg')]" 
            />

            <div className="container mx-auto px-4 relative z-10 flex flex-col min-h-screen justify-center items-center">
                <div className="text-center mb-8 max-w-3xl rounded-4xl bg-black/40">
                    <h1 className="text-4xl font-bold text-white mx-6 my-5 drop-shadow-lg ">
                        Rent a Car for Every Journey
                    </h1>
                </div>
                
                <ReservationSearchContainer />
            </div>
        </div>
    );
};