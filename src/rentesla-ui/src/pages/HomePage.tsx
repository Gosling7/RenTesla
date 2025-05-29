import { ReservationSearchContainer } from '../components/ReservationSearchContainer'
import '../Home.css'

export const HomePage = () => {
    return (    
        <>
            <div className="relative min-h-screen">
                            
                {/* Background Image - Switching between light/dark mode */}
                <div className=" rounded-4xl absolute inset-0 bg-cover bg-center z-[-1]
                    bg-[url('/images/home-page-light-bg.jpg')]
                    dark:bg-[url('/images/home-page-dark-bg.jpg')]" />
                


                {/* Hero Content */}
                <div className="container mx-auto px-4 relative z-10 flex flex-col min-h-screen justify-center items-center">
                    <div className="text-center mb-8 max-w-3xl rounded-4xl bg-black/40">
                        <h1 className="text-4xl font-bold text-white mx-6 my-5 drop-shadow-lg ">
                            Rent a Car for Every Journey
                        </h1>
                    </div>
                    
                    <ReservationSearchContainer />
                </div>
            </div>
        </>

        // {/* Stare */}
        //      {/* <div className="rounded-4xl bg-cover bg-center min-h-screen flex flex-col justify-end items-center py-20
        // //         bg-[url('/images/home-page-light-bg.jpg')]
        // //         dark:bg-[url('/images/home-page-dark-bg.jpg')]"
        // //     >
                
        // //         <div className="bg-neutral-900/50  rounded-4xl px-6 pt-4 pb-6">
        // //             <h1 className="text-4xl font-bold text-white">Rent a Car for Every Journey</h1>
        // //         </div>

        // //         <ReservationSearchContainer />     
        // //     </div> */}
    );
};