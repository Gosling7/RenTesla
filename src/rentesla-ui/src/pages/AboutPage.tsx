import { useEffect, useState } from 'react';
import axios from 'axios';
import { CarModelDto } from '../types/ApiResults';
import { getImageForCarModel } from '../utils/carImageMap';
import { Header } from '../components/Header';

export const AboutPage = () => {
    const [carModels, setCarModels] = useState<CarModelDto[]>([]);
    const [error, setError] = useState<string>('');
    
    useEffect(() => {
        const fetchCarModels = async () => {
            try {
                const response = await axios.get<CarModelDto[]>('/api/car-models');
                setCarModels(response.data);
            } catch (err: any) {
                setError('Failed to load car models.');
            }
        };
        
        fetchCarModels();
    }, []);
    
    return (
        <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Header */}
                <Header 
                    title="About Our Car Rental"
                    subtitle="Discover our premium fleet and exceptional service."
                    //className="mb-12"
                />

                {/* <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                        About Our Car Rental
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        We provide premium vehicles with exceptional service to make every journey memorable.
                    </p>
                </div> */}

                {error && (
                    <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-lg max-w-2xl mx-auto mb-8 text-center">
                        {error}
                    </div>
                )}

                {/* Fleet Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {carModels.map((model) => (
                        <div 
                            key={model.id} 
                            className="group relative overflow-hidden rounded-xl bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-md transition-colors duration-300"
                        >
                            <div className="aspect-w-3 aspect-h-2">
                                <img
                                    src={getImageForCarModel(model.name)}
                                    alt={model.name}
                                    className="w-full h-56 object-cover"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                                    {model.name}
                                </h3>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Daily</span>
                                        <p className="text-xl font-bold dark:text-white">€{model.baseDailyRate}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-gray-500 dark:text-gray-400 text-sm">Hourly</span>
                                        <p className="text-xl font-bold dark:text-white">€{model.baseDailyRate / 10}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                     {carModels.map((model) => (
                         <div key={model.id} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                             <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                                 <img
                                     src={getImageForCarModel(model.name)}
                                     alt={model.name}
                                     className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                                 />
                             </div>
                             <div className="p-6">
                                 <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
                                 <div className="flex justify-between text-lg">
                                     <span className="text-gray-300">€{model.baseDailyRate}<span className="text-sm">/day</span></span>
                                     <span className="text-gray-300">€{model.baseDailyRate / 10}<span className="text-sm">/hour</span></span>
                                 </div>
                            </div>
                         </div>
                     ))}
                </div> */}

                {/* Additional Info */}
                <div className="mt-20 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                        Why Choose Us?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { 
                                title: "Premium Vehicles", 
                                desc: "Only the finest cars in perfect condition",
                                icon: "🚗"
                            },
                            { 
                                title: "Flexible Rental", 
                                desc: "Hourly, daily, or long-term options",
                                icon: "⏱️"
                            },
                            { 
                                title: "24/7 Support", 
                                desc: "Always available to assist you",
                                icon: "📞"
                            }
                        ].map((item, index) => (
                            <div 
                                key={index} 
                                className="p-6 bg-gray-50 dark:bg-neutral-900 rounded-lg border border-gray-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-colors duration-300"
                            >
                                <div className="text-4xl mb-4">{item.icon}</div>
                                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                                    {item.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    {item.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        // <div className="min-h-screen text-white ">
        //     {/* Hero Section */}
        //     <div className="z-10 rounded-t-4xl relative h-96 flex items-center justify-center bg-[url('/images/tesla-model-y.jpg')] bg-cover bg-center">
        //         <div className="relative text-center px-4">
        //             <h1 className="text-5xl font-bold mb-4">Drive Your Dreams</h1>
        //             <p className="text-xl max-w-2xl mx-auto">
        //                 Premium vehicles, unparalleled service, and unforgettable journeys
        //             </p>
        //         </div>
        //     </div>

        //     {/* Content Section */}
        //     <div className="z-20 rounded-t-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 -mt-5 bg-amber-800">
        //         <div className="text-center mb-16">
        //             <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        //                 Our Exceptional Fleet
        //             </h2>
        //             <p className="mt-4 max-w-2xl text-xl text-gray-300 mx-auto">
        //                 Each vehicle is meticulously maintained for your comfort and safety
        //             </p>
        //         </div>

        //         {error && <p className="text-red-400 text-center mb-8">{error}</p>}

        //         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        //             {carModels.map((model) => (
        //                 <div key={model.id} className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
        //                     <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        //                         <img
        //                             src={getImageForCarModel(model.name)}
        //                             alt={model.name}
        //                             className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
        //                         />
        //                     </div>
        //                     <div className="p-6">
        //                         <h3 className="text-2xl font-bold mb-2">{model.name}</h3>
        //                         <div className="flex justify-between text-lg">
        //                             <span className="text-gray-300">€{model.baseDailyRate}<span className="text-sm">/day</span></span>
        //                             <span className="text-gray-300">€{model.baseDailyRate / 10}<span className="text-sm">/hour</span></span>
        //                         </div>
        //                     </div>
        //                 </div>
        //             ))}
        //         </div>
        //     </div>
        // </div>


        // <div 
        //     className="text-white p-8 max-w-5xl mx-auto mt-10 rounded-xl shadow-lg
        //     bg-white
        //     dark:bg-black"
        // >
        //     <h1 className="text-4xl font-bold mb-6 text-center">About Our Car Rental Service</h1>
        //     <p className="mb-10 text-lg text-gray-300 text-center">
        //         Discover a fleet of premium vehicles ready for your next adventure.
        //     </p>
            
        //     {error && <p className="text-red-400 text-center mb-4">{error}</p>}
            
        //     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        //         {carModels.map((model) => (
        //             <div key={model.id} className="bg-gray-800 rounded-lg overflow-hidden shadow">
        //                 <img
        //                     src={getImageForCarModel(model.name)}
        //                     alt={model.name}
        //                     className="w-full h-48 object-cover"
        //                 />
                        
        //                 <div className="p-4">
        //                     <h3 className="text-xl font-semibold">{model.name}</h3>
        //                     <p className="text-gray-300 mt-1">€{model.baseDailyRate} / day</p>
        //                     <p className="text-gray-300 mt-1">€{model.baseDailyRate / 10} / hour</p>
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
    );
};